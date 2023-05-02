import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { DeleteResult, Repository, Transaction, UpdateResult } from 'typeorm';
import { TopicsService } from 'src/topics/topics.service';
import { Topics } from 'src/topics/topics.entity';
import { UpdatePostDto } from './dto/update-post.dto';

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

  async update(updatePostDto: UpdatePostDto, id: number): Promise<Posts> {
    const foundPost = await this.postsRepository.findOne({
      where: {id},
      relations: ['topics']
    });

    const topicNames: string[] = updatePostDto.topics;
    const savedTopics: Topics[] = await this.topicsService.create(topicNames);

    foundPost.update(updatePostDto, savedTopics);

    const savedPost = await this.postsRepository.save(foundPost);

    return savedPost;
  }
  
  async delete(id: number): Promise<Posts> {
    const foundPost: Posts = await this.postsRepository.findOne({where: {id}});
    foundPost.delete();

    return this.postsRepository.save(foundPost);
  }

  findAll(): Promise<Posts[]> {
    return this.postsRepository.find({
      where: {status: 0},
      relations: ['topics'],
      order: {
        createdAt: 'DESC',
      },
    })
  }

  findOne(id: number): Promise<Posts> {
    return this.postsRepository.findOne({
      relations: ['comments'],
      where: {id},
    });
  }

  // async remove(id: number) {
  //   await this.postsRepository.delete({id})
  // }
}
