import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Topics } from "./topics.entity";
import { Equal, In, Repository } from "typeorm";
import { TopicsWithCategoriesDto } from "./dto/topics-with-categories.dto";
import { TopicsWithChaptersDto } from "./dto/topics-with-chapters.dto";
import { TopicsDto } from "./dto/topics.dto";
import { Categories } from "src/categories/entities/Categories.entity";
import { CategoriesService } from "src/categories/categories.service";
import { TopicsWithCategoriesResDto } from "./dto/topics-with-categories-res.dto";
import { NewTopicsDto } from "./dto/new-topics.dto";
import { UsersService } from "src/users/users.service";

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

  async findAllWithCategories(): Promise<TopicsWithCategoriesResDto> {
    // 1. find all Categories
    const allCategories: Categories[] = await this.categoriesService.findAll();

    // 2. find all Topics
    const allTopics: TopicsWithCategoriesDto[] = await this.topicsRepository
      .createQueryBuilder('Topics')
      .leftJoinAndSelect('Topics.categories', 'Categories')
      .select(['Topics.name AS name', 'Topics.id AS id', 'Topics.description AS description', 'Topics.orders AS orders', 'Categories.id AS categoriesId'])
      .orderBy('orders', 'DESC')
      .getRawMany<TopicsWithCategoriesDto>();

    // 3. create Res DTO
    const categoriesDtoList = allCategories.map(c => c.toCategoriesDto());
    const result: TopicsWithCategoriesResDto = {
      categories: categoriesDtoList,
      topics: allTopics,
    };

    return result;
  }

  findAllWithPosts(): Promise<TopicsWithChaptersDto[]> {
    return this.topicsRepository.find({
      relations: ['chaptersList', 'chaptersList.postsList', 'users'],
      select: {users: {id: true, name: true, profileImage: true}},
      order: {orders: 'DESC'},
    });
  }

  async findOne(id: number): Promise<Topics> {
    return this.topicsRepository.findOne({
      where: { id },
    });
  };

  async findOneWithChapters(id: number): Promise<TopicsWithChaptersDto> {
    return this.topicsRepository.findOne({
      where: { id },
      relations: ['chaptersList', 'chaptersList.postsList', 'users'],
      select: {users: {id: true, name: true, profileImage: true}},
    });
  };

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

  delete(topicsId: number) {
    this.topicsRepository.delete({ id: topicsId });
  }
}