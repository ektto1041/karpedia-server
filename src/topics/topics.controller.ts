import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Req } from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { TopicsDto } from "./dto/topics.dto";
import { NewTopicsDto } from "./dto/new-topics.dto";
import { Request } from "express";
import { TopicsWithOneChaptersDto } from "./dto/topics-with-one-chapters.dto";
import { TopicsWithOneChaptersWithOnePostsDto } from "./dto/topics-with-one-chapters-with-one-posts.dto";
import { SubscribeTopicsResultDto } from "./dto/subscribe-topics-result.dto";
import { TopicsWithCategoriesNameDto } from "./dto/topics-with-categories-name.dto";

@Controller('topics')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
  ) {}

  @Get()
  async findAll(): Promise<TopicsDto[]> {
    const foundTopics = await this.topicsService.findAll();
    return foundTopics.map(t => t.toTopicsDto());
  }

  @Get('subscribed')
  async findAllSubscribed(@Req() req: Request): Promise<TopicsWithCategoriesNameDto[]> {
    const usersId: number = req.cookies.uid;

    return await this.topicsService.findAllSubscribed(usersId);
  }

  @Get('posts')
  async findAllWithChaptersWithPosts() {
    return this.topicsService.findAllWithChaptersWithPosts();
  }

  @Get(['categories', 'setting'])
  async findAllWithCategories() {
    return this.topicsService.findAllWithCategories();
  }

  @Get(':id')
  async findOneWithChaptersWithPosts(@Param('id') id: number) {
    const result = await this.topicsService.findOneWithChaptersWithPosts(id);

    return result;
  }

  @Get(':id/chapters')
  async findOneWithChapters(@Param('id') id: number) {
    const result = await this.topicsService.findOneWithChapters(id);

    return result;
  }

  @Get(':topicsId/chapters/first')
  async findFirstInTopics(@Param('topicsId') topicsId: number): Promise<TopicsWithOneChaptersDto> {
    try {
      const foundTopics = await this.topicsService.findOneWithFirstChapters(topicsId);

      return foundTopics;
    } catch(error) {
      throw new HttpException('Not Found Topic', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':topicsId/chapters/:chaptersId')
  async getOneTopicsByIdWithOneChaptersById(@Param('topicsId') topicsId: number, @Param('chaptersId') chaptersId: number): Promise<TopicsWithOneChaptersDto> {
    try {
      return await this.topicsService.findOneWithOneChaptersById(topicsId, chaptersId);
    } catch(error) {
      throw new HttpException('Not Found Topic|Chapter', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':topicsId/chapters/:chaptersId/posts/:postsId')
  async getOneTopicsByIdWithOneChaptersByIdWithOnePostsById(@Param('topicsId') topicsId: number, @Param('chaptersId') chaptersId: number, @Param('postsId') postsId: number): Promise<TopicsWithOneChaptersWithOnePostsDto> {
    try {
      return await this.topicsService.findOneWithOneChaptersWithOnePosts(topicsId, chaptersId, postsId);
    } catch(error) {
      throw new HttpException('Not Found Topic|Chapter|Post', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  async create(@Body() newTopics: NewTopicsDto, @Req() req: Request): Promise<TopicsDto> {
    const usersId: number = parseInt(req.cookies.uid);

    return this.topicsService.create(newTopics, usersId);
  }

  @Put()
  async update(@Body() topics: TopicsDto) {
    return this.topicsService.update(topics);
  }

  @Patch('subscribe/:topicsId')
  async subscribeTopics(@Param('topicsId') topicsId: number, @Req() req: Request): Promise<SubscribeTopicsResultDto> {
    const usersId: number = parseInt(req.cookies.uid);

    const subscribeResult = await this.topicsService.subscribe(usersId, topicsId);

    return new SubscribeTopicsResultDto(subscribeResult);
  }

  @Patch(':from/:to')
  async swapOrders(@Param('from') from: number, @Param('to') to: number): Promise<void> {
    this.topicsService.swapOrders(from, to);
  }


  @Delete(':id')
  delete(@Param('id') id: number) {
    this.topicsService.delete(id);
  }
}