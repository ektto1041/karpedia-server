import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapters } from './chapters.entity';
import { Repository } from 'typeorm';
import { NewChaptersDto } from './dto/new-chapters.dto';
import { TopicsService } from 'src/topics/topics.service';
import { ChaptersDto } from './dto/chapters.dto';

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
    const savedChapters = await this.chaptersRepository.save(chapters);

    return savedChapters.toChaptersDto();
  }
}
