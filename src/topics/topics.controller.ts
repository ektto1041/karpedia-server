import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { TopicsDto } from "./dto/topics.dto";
import { NewTopicsDto } from "./dto/new-topics.dto";
import { Request } from "express";

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

  @Get('posts')
  async findAllWithChaptersWithPosts() {
    return this.topicsService.findAllWithChaptersWithPosts();
  }

  @Get(['categories', 'setting'])
  findAllWithCategories() {
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

  @Post()
  async create(@Body() newTopics: NewTopicsDto, @Req() req: Request): Promise<TopicsDto> {
    const usersId: number = parseInt(req.cookies.uid);

    return this.topicsService.create(newTopics, usersId);
  }

  @Put()
  async update(@Body() topics: TopicsDto) {
    return this.topicsService.update(topics);
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