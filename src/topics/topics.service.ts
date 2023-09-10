import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Topics } from "./topics.entity";
import { In, Repository } from "typeorm";
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

    topics.categories = foundCategories;
    topics.users = foundUsers;

    const savedTopics = await this.topicsRepository.save(topics);
    return savedTopics.toTopicsDto();
  }

  async findAll(): Promise<TopicsDto[]> {
    const foundTopics = await this.topicsRepository.find();
    return foundTopics.map(t => t.toTopicsDto());
  }

  async findAllWithCategories(): Promise<TopicsWithCategoriesResDto> {
    // 1. find all Categories
    const allCategories: Categories[] = await this.categoriesService.findAll();

    // 2. find all Topics
    const allTopics: TopicsWithCategoriesDto[] = await this.topicsRepository
      .createQueryBuilder('Topics')
      .leftJoinAndSelect('Topics.categories', 'Categories')
      .select(['Topics.name AS name', 'Topics.id AS id', 'Topics.description AS description', 'Categories.id AS categoriesId'])
      .getRawMany<TopicsWithCategoriesDto>();

    // 3. create Res DTO
    const categoriesDtoList = allCategories.map(c => c.toCategoriesDto());
    const result: TopicsWithCategoriesResDto = {
      categories: categoriesDtoList,
      topics: allTopics,
    };

    return result;
  }

  findThem(topicNames: string[]): Promise<Topics[]> {
    return this.topicsRepository.find({
      where: {
        name: In(topicNames),
      },
    });
  };

  findAllWithPosts(): Promise<TopicsWithChaptersDto[]> {
    return this.topicsRepository.find({
      relations: ['chaptersList', 'chaptersList.postsList'],
    });
  }

  findOne(id: number): Promise<TopicsWithChaptersDto> {
    return this.topicsRepository.findOne({
      where: { id },
      relations: ['chaptersList', 'chaptersList.postsList'],
    });
  };

  async update(topics: TopicsDto): Promise<TopicsDto> {
     const foundTopics = await this.topicsRepository.findOne({ where: { id: topics.id } });
     foundTopics.update(topics);
     const savedTopics = await this.topicsRepository.save(foundTopics);
     return savedTopics.toTopicsDto();
  }

  delete(topicsId: number) {
    this.topicsRepository.delete({ id: topicsId });
  }
}