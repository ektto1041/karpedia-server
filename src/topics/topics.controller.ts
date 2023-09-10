import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
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
    const result = await this.topicsService.findOne(id);

    return result;
  }

  @Post()
  async create(@Body() newTopics: NewTopicsDto, @Req() req: Request): Promise<TopicsDto> {
    const usersId: number = parseInt(req.cookies.uid);

    return this.topicsService.create(newTopics, usersId);
  }
}