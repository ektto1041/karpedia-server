import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapters } from './chapters.entity';
import { Equal, In, Repository } from 'typeorm';
import { NewChaptersDto } from './dto/new-chapters.dto';
import { TopicsService } from 'src/topics/topics.service';
import { ChaptersDto } from './dto/chapters.dto';
import { ChaptersWithTopicsIdDto } from './dto/chapters-with-topics-id.dto';
import { NewChaptersUpdateDto } from './dto/new-chapters-update.dto';
import { ChaptersTitleDto } from './dto/chapters-title.dto';
import { Topics } from 'src/topics/topics.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapters)
    private readonly chaptersRepository: Repository<Chapters>,
    private readonly topicsService: TopicsService,
  ) {}

  async create(newChapters: NewChaptersDto): Promise<ChaptersDto> {
    const chapters = Chapters.fromNewChaptersDto(newChapters);

    const foundTopics = await this.topicsService.findOne(newChapters.topicId);
    chapters.topics = foundTopics;

    const {maxOrder} = await this.chaptersRepository.createQueryBuilder('Chapters')
      .select('MAX(Chapters.orders)', 'maxOrder')
      .where('Chapters.topicsId = :topicId', { topicId: foundTopics.id })
      .getRawOne();
    chapters.orders = maxOrder+1;

    const savedChapters = await this.chaptersRepository.save(chapters);

    return savedChapters.toChaptersDto();
  };

  async findOneById(chapterId: number): Promise<Chapters> {
    return this.chaptersRepository.findOne({ relations: { topics: true }, where: { id: chapterId } });
  };

  async findOneByIdWithTopicsId(chapterId: number): Promise<ChaptersWithTopicsIdDto> {
    return this.chaptersRepository.createQueryBuilder('Chapters')
    .leftJoinAndSelect('Chapters.topics', 'Topics')
    .select([
      'Chapters.id AS id',
      'Chapters.title AS title',
      'Chapters.content AS content',
      'Chapters.orders AS orders',
      'Topics.id AS topicsId'])
    .where('Chapters.id = :chapterId', { chapterId })
    .getRawOne<ChaptersWithTopicsIdDto>()
  };

  async findAllTitleByTopic(topics: Topics): Promise<ChaptersTitleDto[]> {
    return await this.chaptersRepository.find({
      select: ['id', 'title', 'orders'],
      where: { topics: { id: topics.id } },
      order: { orders: 'ASC' },
    });
  };

  async findFirstInTopics(topicsId: number): Promise<Chapters | null> {
    return await this.chaptersRepository.findOne({
      where: { topics: { id: topicsId } }
    });
  }

  async update(newChapters: NewChaptersUpdateDto): Promise<Chapters> {
    const {id} = newChapters;

    const foundChapters = await this.chaptersRepository.findOne({
      relations: {topics: true},
      where: {id},
    });

    foundChapters.title = newChapters.title;
    foundChapters.content = newChapters.content;

    if(foundChapters.topics.id !== newChapters.topicId) {
      const foundTopics = await this.topicsService.findOne(newChapters.topicId);
      foundChapters.topics = foundTopics;

      const {maxOrder} = await this.chaptersRepository.createQueryBuilder('Chapters')
        .select('MAX(Chapters.orders)', 'maxOrder')
        .where('Chapters.topicsId = :topicId', { topicId: foundTopics.id })
        .getRawOne();
      foundChapters.orders = maxOrder+1;
    }
    
    return await this.chaptersRepository.save(foundChapters);
  };

  async swapOrders(from: number, to: number): Promise<void> {
    const [a, b] = await this.chaptersRepository.find({
      where: {
        id: In([from, to]),
      },
    });

    const tmp = a.orders;
    a.orders = b.orders;
    b.orders = tmp;

    await this.chaptersRepository.save(a);
    await this.chaptersRepository.save(b);
  };
}
