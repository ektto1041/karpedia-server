import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { Repository } from 'typeorm';
import { NewPostsDto } from './dto/new-posts.dto';
import { ChaptersService } from 'src/chapters/chapters.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private readonly chaptersService: ChaptersService,
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

    return savedPosts;
  };
}
