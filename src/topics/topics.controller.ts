import { Body, Controller, Delete, Get, Param, Post, Put, Req } from "@nestjs/common";
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
    return this.topicsService.findAll();
  }

  @Get('posts')
  async findAllWithPosts() {
    return this.topicsService.findAllWithPosts();
  }

  @Get(['categories', 'setting'])
  findAllWithCategories() {
    return this.topicsService.findAllWithCategories();
  }
  @Get(':id')
  async findOne(@Param('id') id: number) {
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

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.topicsService.delete(id);
  }
}