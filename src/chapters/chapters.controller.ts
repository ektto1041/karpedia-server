import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { NewChaptersDto } from './dto/new-chapters.dto';
import { ChaptersDto } from './dto/chapters.dto';
import { TopicsService } from 'src/topics/topics.service';
import { UpdateChaptersDto } from './dto/update-chapters.dto';
import { ChaptersWithTopicsIdDto } from './dto/chapters-with-topics-id.dto';

@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly chaptersService: ChaptersService,
    private readonly topicsService: TopicsService,
  ) {}

  @Get('update/:id')
  async getUpdateChapters(@Param('id') id: number): Promise<UpdateChaptersDto> {
    const topicsNames = await this.topicsService.findAllName();
    const foundChapters = await this.chaptersService.findOneByIdWithTopicsId(id);

    return {
      topicsList: topicsNames,
      chapters: foundChapters,
    };
  };

  @Post()
  async create(@Body() newChapters: NewChaptersDto): Promise<ChaptersDto> {
    return this.chaptersService.create(newChapters);
  };

  @Patch(':from/:to')
  async swapOrders(@Param('from') from: number, @Param('to') to: number): Promise<void> {
    this.chaptersService.swapOrders(from, to);
  };
};
