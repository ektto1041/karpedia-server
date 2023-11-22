import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { In, Repository } from 'typeorm';
import { NewPostsDto } from './dto/new-posts.dto';
import { ChaptersService } from 'src/chapters/chapters.service';
import { NewPostsUpdateDto } from './dto/new-posts-update.dto';
import { TopicsService } from 'src/topics/topics.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private readonly chaptersService: ChaptersService,
    private readonly topicsService: TopicsService,
    private readonly mailService: MailService,
  ) {}

  async create(newPosts: NewPostsDto): Promise<Posts> {
    const posts = Posts.fromNewPostsDto(newPosts);

    const foundChapters = await this.chaptersService.findOneById(newPosts.chapterId);
    posts.chapters = foundChapters;

    const {maxOrder} = await this.postsRepository.createQueryBuilder('Posts')
      .select('MAX(Posts.orders)', 'maxOrder')
      .where('Posts.chaptersId = :chapterId', { chapterId: foundChapters.id })
      .getRawOne();
    posts.orders = maxOrder+1;

    const savedPosts = await this.postsRepository.save(posts);

    // 메일 처리
    const subscribers = await this.topicsService.getSubscribers(foundChapters.topics.id);
    console.log('### Subscribers: ');
    console.log(subscribers);

    this.mailService.sendToSubscribers(subscribers, foundChapters.topics.name, foundChapters.topics.id);

    return savedPosts;
  };

  async update(newPosts: NewPostsUpdateDto): Promise<Posts> {
    const { id, title, content, chapterId } = newPosts;

    const foundPosts = await this.postsRepository.findOne({
      relations: { chapters: true },
      where: { id },
    });

    if(chapterId !== foundPosts.chapters.id) {
      const foundChapters = await this.chaptersService.findOneById(chapterId);
      foundPosts.chapters = foundChapters;

      const {maxOrder} = await this.postsRepository.createQueryBuilder('Posts')
        .select('MAX(Posts.orders)', 'maxOrder')
        .where('Posts.chaptersId = :chapterId', { chapterId: foundChapters.id })
        .getRawOne();
      foundPosts.orders = maxOrder+1;
    }

    foundPosts.title = title;
    foundPosts.content = content;

    return await this.postsRepository.save(foundPosts);
  };

  async findOneById(postsId: number): Promise<Posts> {
    return await this.postsRepository.findOne({
      where: {
        id: postsId,
      },
    });
  };

  async findOneWithChaptersWithTopicsById(postId: number): Promise<Posts> {
    return await this.postsRepository.findOne({
      relations: ['chapters', 'chapters.topics'],
      where: { id: postId },
    });
  }

  async swapOrders(from: number, to: number): Promise<void> {
    const [a, b] = await this.postsRepository.find({
      where: {
        id: In([from, to]),
      },
    });

    const tmp = a.orders;
    a.orders = b.orders;
    b.orders = tmp;

    await this.postsRepository.save(a);
    await this.postsRepository.save(b);
  };
}
