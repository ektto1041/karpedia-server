import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Topics } from "./topics.entity";
import { In, Repository } from "typeorm";
import { TopicsWithCategoriesIdDto } from "./dto/topics-with-categories-id.dto";
import { TopicsWithChaptersWithPostsDto } from "./dto/topics-with-chapters-with-posts.dto";
import { TopicsDto } from "./dto/topics.dto";
import { Categories } from "src/categories/categories.entity";
import { CategoriesService } from "src/categories/categories.service";
import { TopicsWithCategoriesResDto } from "./dto/topics-with-categories-res.dto";
import { NewTopicsDto } from "./dto/new-topics.dto";
import { UsersService } from "src/users/users.service";
import { TopicsWithChaptersDto } from "./dto/topics-with-chapters.dto";
import { TopicsNameDto } from "./dto/topics-name.dto";
import { TopicsWithOneChaptersDto, TopicsWithOneChaptersRaw } from "./dto/topics-with-one-chapters.dto";
import { TopicsWithOneChaptersWithOnePostsDto, TopicsWithOneChaptersWithOnePostsRaw } from "./dto/topics-with-one-chapters-with-one-posts.dto";
import { Users } from "src/users/users.entity";
import { TopicsWithCategoriesNameDto } from "./dto/topics-with-categories-name.dto";
import { Subscriber } from "src/users/dto/subscriber.dto";

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topics)
    private topicsRepository: Repository<Topics>,
    private categoriesService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  async create(newTopics: NewTopicsDto, userId: number): Promise<TopicsDto> {
    const topics = Topics.fromNewTopicsDto(newTopics);

    const foundCategories = await this.categoriesService.findById(newTopics.categoriesId);
    const foundUsers = await this.usersService.findByUserId(userId);

    const {maxOrder} = await this.topicsRepository.createQueryBuilder('Topics')
      .select('MAX(Topics.orders)', 'maxOrder')
      .where('Topics.categoriesId = :categoryId', { categoryId: foundCategories.id })
      .getRawOne();
    
    topics.orders = maxOrder+1;

    topics.categories = foundCategories;
    topics.users = foundUsers;

    const savedTopics = await this.topicsRepository.save(topics);
    return savedTopics.toTopicsDto();
  }

  async findAll(): Promise<Topics[]> {
    return await this.topicsRepository.find({
      order: { orders: 'DESC' },
    });
  }

  async findAllName(): Promise<TopicsNameDto[]> {
    return await this.topicsRepository.find({
      select: ['id', 'name', 'orders'],
      order: { orders: 'DESC' },
    });
  };

  async findAllWithCategories(): Promise<TopicsWithCategoriesResDto> {
    // 1. find all Categories
    const allCategories: Categories[] = await this.categoriesService.findAll();

    // 2. find all Topics
    const allTopics: TopicsWithCategoriesIdDto[] = await this.topicsRepository
      .createQueryBuilder('Topics')
      .leftJoinAndSelect('Topics.categories', 'Categories')
      .select(['Topics.name AS name', 'Topics.id AS id', 'Topics.description AS description', 'Topics.orders AS orders', 'Categories.id AS categoriesId'])
      .orderBy('orders', 'DESC')
      .getRawMany<TopicsWithCategoriesIdDto>();

    // 3. create Res DTO
    const categoriesDtoList = allCategories.map(c => c.toCategoriesDto());
    const result: TopicsWithCategoriesResDto = {
      categories: categoriesDtoList,
      topics: allTopics,
    };

    return result;
  }

  findAllWithChaptersWithPosts(): Promise<TopicsWithChaptersWithPostsDto[]> {
    return this.topicsRepository.find({
      relations: ['chaptersList', 'chaptersList.postsList', 'users'],
      select: {users: {id: true, name: true, profileImage: true}},
      order: {orders: 'DESC'},
    });
  };

  async findOne(id: number): Promise<Topics> {
    return this.topicsRepository.findOne({
      where: { id },
    });
  };

  async findOneWithChaptersWithPosts(id: number): Promise<TopicsWithChaptersWithPostsDto> {
    return this.topicsRepository.findOne({
      where: { id },
      relations: ['chaptersList', 'chaptersList.postsList', 'users'],
      select: {users: {id: true, name: true, profileImage: true}},
    });
  };

  async findOneWithChapters(id: number): Promise<TopicsWithChaptersDto> {
    return this.topicsRepository.findOne({
      where: { id },
      relations: ['chaptersList', 'users'],
      select: {users: {id: true, name: true, profileImage: true}},
    });
  };

  async findOneWithFirstChapters(id: number): Promise<TopicsWithOneChaptersDto> {
    const foundTopics = await this.topicsRepository.createQueryBuilder('Topics')
      .leftJoinAndSelect('Topics.chaptersList', 'Chapters')  
      .select([
        'Topics.*',
        'Chapters.id AS chaptersId',
        'Chapters.title AS chaptersTitle',
        'Chapters.content AS chaptersContent',
        'Chapters.orders AS chaptersOrders',
      ])  
      .where('Topics.id = :topicsId', { topicsId: id })
      .orderBy('chaptersOrders', 'ASC')
      .getRawOne<TopicsWithOneChaptersRaw>();
    
    return TopicsWithOneChaptersDto.fromRaw(foundTopics);
  }

  async findOneWithOneChaptersById(topicsId: number, chaptersId: number): Promise<TopicsWithOneChaptersDto> {
    const foundTopics = await this.topicsRepository.createQueryBuilder('Topics')
      .leftJoinAndSelect('Topics.chaptersList', 'Chapters')
      .select([
        'Topics.*',
        'Chapters.id AS chaptersId',
        'Chapters.title AS chaptersTitle',
        'Chapters.content AS chaptersContent',
        'Chapters.orders AS chaptersOrders',
      ])
      .where('Topics.id = :topicsId', { topicsId })
      .andWhere('Chapters.id = :chaptersId', { chaptersId })
      .getRawOne<TopicsWithOneChaptersRaw>();

    return TopicsWithOneChaptersDto.fromRaw(foundTopics);
  }

  async findOneWithOneChaptersWithOnePosts(topicsId: number, chaptersId: number, postsId: number): Promise<TopicsWithOneChaptersWithOnePostsDto> {
    const foundTopics = await this.topicsRepository.createQueryBuilder('Topics')
      .leftJoin('Topics.chaptersList', 'Chapters')
      .leftJoin('Chapters.postsList', 'Posts')
      .select([
        'Topics.*',
        'Chapters.id AS chaptersId',
        'Chapters.title AS chaptersTitle',
        'Chapters.content AS chaptersContent',
        'Chapters.orders AS chaptersOrders',
        'Posts.id AS postsId',
        'Posts.title AS postsTitle',
        'Posts.content AS postsContent',
        'Posts.orders AS postsOrders',
        'Posts.status AS postsStatus',
        'Posts.viewCount AS postsViewCount',
        'Posts.createdAt AS postsCreatedAt',
        'Posts.modifiedAt AS postsModifiedAt',
      ])
      .where('Topics.id = :topicsId', { topicsId })
      .andWhere('Chapters.id = :chaptersId', { chaptersId })
      .andWhere('Posts.id = :postsId', { postsId })
      .getRawOne<TopicsWithOneChaptersWithOnePostsRaw>();
    
    return TopicsWithOneChaptersWithOnePostsDto.fromRaw(foundTopics);
  }

  async findAllSubscribed(usersId: number): Promise<TopicsWithCategoriesNameDto[]> {
    return await this.topicsRepository.createQueryBuilder('Topics')
      .leftJoin('Topics.subscribedUsers', 'SubsUsers')
      .leftJoin('Topics.categories', 'Categories')
      .select('Topics.id', 'id')
      .addSelect('Topics.name', 'name')
      .addSelect('Topics.description', 'description')
      .addSelect('Topics.orders', 'orders')
      .addSelect('Categories.name', 'categoriesName')
      .where('SubsUsers.id = :usersId', { usersId })
      .getRawMany<TopicsWithCategoriesNameDto>();
  }

  async update(topics: TopicsDto): Promise<TopicsDto> {
     const foundTopics = await this.topicsRepository.findOne({ where: { id: topics.id } });
     foundTopics.update(topics);
     const savedTopics = await this.topicsRepository.save(foundTopics);
     return savedTopics.toTopicsDto();
  }

  async swapOrders(from: number, to: number): Promise<void> {
    const [a, b] = await this.topicsRepository.find({
      where: {
        id: In([from ,to]),
      },
    });

    const tmp = a.orders;
    a.orders = b.orders;
    b.orders = tmp;

    await this.topicsRepository.save(a);
    await this.topicsRepository.save(b);
  };

  async subscribe(usersId: number, topicsId: number): Promise<boolean> {
    const found = await this.topicsRepository.createQueryBuilder('Topics')
      .leftJoin('Topics.subscribedUsers', 'SubsUsers')
      .select('SubsUsers.id AS usersId')
      .where('Topics.id = :topicsId', { topicsId })
      .andWhere('SubsUsers.id = :usersId', { usersId })
      .getRawOne();
    
    let subscribeResult = false;
    if(found?.usersId) {
      await this.topicsRepository.createQueryBuilder('Topics')
        .relation(Users, 'subscribedTopics')
        .of(usersId)
        .remove(topicsId);
    } else {
      await this.topicsRepository.createQueryBuilder('Topics')
        .relation(Users, 'subscribedTopics')
        .of(usersId)
        .add(topicsId);
      
      subscribeResult = true;
    }

    return subscribeResult;
  }

  async getSubscribers(topicsId: number): Promise<Subscriber[]> {
    const result = await this.topicsRepository.createQueryBuilder('Topics')
      .leftJoin('Topics.subscribedUsers', 'Users')
      .select('Users.email', 'email')
      .addSelect('Users.isSubscribedTopicsAlarmAllowed', 'isSubscribedTopicsAlarmAllowed')
      .where({ id: topicsId })
      .getRawMany<Subscriber>();
    
    return result.filter(s => s.isSubscribedTopicsAlarmAllowed === 1);
  }

  delete(topicsId: number) {
    this.topicsRepository.delete({ id: topicsId });
  }
}