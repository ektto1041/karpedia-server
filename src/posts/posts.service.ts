import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { TopicsService } from 'src/topics/topics.service';
import { Topics } from 'src/topics/topics.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private readonly topicsService: TopicsService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Posts> {
    const topicNames: string[] = createPostDto.topics;
    const savedTopics: Topics[] = await this.topicsService.create(topicNames);
    // const topics = await this.topicsService.create(createPostDto.topics);
    const newPost: Posts = new Posts(createPostDto, savedTopics);
    const savedPost: Posts = await this.postsRepository.save(newPost);

    return savedPost;
  }

  // findAll(): Promise<Post[]> {
  //   // return this.postsRepository.find();
  // }

  findOne(id: number): Promise<Posts | null> {
    return this.postsRepository.findOne({
      relations: ['comments'],
      where: {id},
    });
  }

  // async remove(id: number) {
  //   await this.postsRepository.delete({id})
  // }
}
