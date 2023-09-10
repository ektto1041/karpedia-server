import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { And, ArrayContains, DataSource, DeleteResult, In, Like, QueryBuilder, Repository, SelectQueryBuilder, Transaction, UpdateResult } from 'typeorm';
import { TopicsService } from 'src/topics/topics.service';
import { Topics } from 'src/topics/topics.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsPaging } from 'src/types';
import { PostItemResDto } from './dto/post-item-res.dto';
import { PostItemDto } from './dto/post-item.dto';

const PAGE_SIZE = 10;

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private readonly a: DataSource,
  ) {}

  // async create(createPostDto: CreatePostDto): Promise<Posts> {
  //   const topicNames: string[] = createPostDto.topics;
  //   const savedTopics: Topics[] = await this.topicsService.create(topicNames);
  //   const newPost: Posts = Posts.create(createPostDto, savedTopics);
  //   const savedPost: Posts = await this.postsRepository.save(newPost);

  //   return savedPost;
  // }

  // async update(updatePostDto: UpdatePostDto, id: number): Promise<Posts> {
  //   const foundPost = await this.postsRepository.findOne({
  //     where: {id},
  //     relations: ['topics']
  //   });

  //   const topicNames: string[] = updatePostDto.topics;
  //   const savedTopics: Topics[] = await this.topicsService.create(topicNames);

  //   foundPost.update(updatePostDto, savedTopics);

  //   const savedPost = await this.postsRepository.save(foundPost);

  //   return savedPost;
  // }
  
  // async delete(id: number): Promise<Posts> {
  //   const foundPost: Posts = await this.postsRepository.findOne({where: {id}});
  //   foundPost.delete();

  //   return this.postsRepository.save(foundPost);
  // }

  // findAll(): Promise<Posts[]> {
  //   return this.postsRepository.find({
  //     where: {status: 0},
  //     relations: ['topics'],
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //   })
  // }

  // async findAllPaging({page, keyword, topics}: PostsPaging): Promise<PostItemResDto> {
  //   // 임시로 OR 조건 검사 하는 쿼리
  //   const query = this.postsRepository.createQueryBuilder('post')
  //     .leftJoin('post.topics', 'topic')
  //     .orderBy({ ['post.createdAt']: 'DESC' })
  //     .where('post.status = 0');
  //   if(keyword) query.andWhere('post.title LIKE :keyword', { keyword: `%${keyword}%` });
  //   if(topics.length > 0) query.andWhere('topic.name In (:...topics)', { topics });
  //   query.skip(page * PAGE_SIZE).take(PAGE_SIZE);

  //   const [foundPostIds, totalCount] = await query.getManyAndCount();
  //   const foundPosts = await this.postsRepository.find({
  //     select: {
  //       id: true,
  //       emoji: true,
  //       title: true,
  //       viewCount: true,
  //       modifiedAt: true,
  //       createdAt: true,
  //     },
  //     where: {
  //       id: In(foundPostIds.map(p => p.id)),
  //     },
  //     order: {
  //       createdAt: 'DESC'
  //     },
  //     relations: ['topics']
  //   })

  //   // 최대 페이지 수 계산
  //   const maxPage = Math.floor(totalCount / PAGE_SIZE) - (totalCount % PAGE_SIZE === 0 ? 1 : 0);

  //   return {
  //     data: foundPosts,
  //     maxPage,
  //   };
  // }

  // findOne(id: number): Promise<Posts> {
  //   return this.postsRepository.findOne({
  //     relations: ['comments', 'topics'],
  //     where: {id},
  //   });
  // };

  // viewPost(id: number): Promise<UpdateResult> {
  //   return this.postsRepository.increment({id}, "viewCount", 1);
  // }
}
