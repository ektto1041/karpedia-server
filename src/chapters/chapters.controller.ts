import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { NewChaptersDto } from './dto/new-chapters.dto';
import { ChaptersDto } from './dto/chapters.dto';
import { TopicsService } from 'src/topics/topics.service';
import { UpdateChaptersDto } from './dto/update-chapters.dto';
import { NewChaptersUpdateDto } from './dto/new-chapters-update.dto';

@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly chaptersService: ChaptersService,
    private readonly topicsService: TopicsService,
  ) {}

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<ChaptersDto> {
    return (await this.chaptersService.findOneById(id)).toChaptersDto();
  }

  @Get('update/:id')
  async getUpdateChapters(@Param('id') id: number): Promise<UpdateChaptersDto> {
    const topicsNames = await this.topicsService.findAllName();
    const foundChapters = await this.chaptersService.findOneByIdWithTopicsId(id);

    return {
      topicsList: topicsNames,
      chapters: foundChapters,
    };
  };

  @Get('topics/:topicsId')
  async findFirstInTopics(@Param('topicsId') topicsId: number): Promise<ChaptersDto | null> {
    const foundChapters = await this.chaptersService.findFirstInTopics(topicsId);

    return foundChapters ? foundChapters.toChaptersDto() : null;
  }

  @Post()
  async create(@Body() newChapters: NewChaptersDto): Promise<ChaptersDto> {
    return this.chaptersService.create(newChapters);
  };

  @Put()
  async update(@Body() newChapters: NewChaptersUpdateDto): Promise<ChaptersDto> {
    const savedChapters = await this.chaptersService.update(newChapters);

    return savedChapters.toChaptersDto();
  };

  @Patch(':from/:to')
  async swapOrders(@Param('from') from: number, @Param('to') to: number): Promise<void> {
    this.chaptersService.swapOrders(from, to);
  };
};
