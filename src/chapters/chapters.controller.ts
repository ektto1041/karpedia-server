import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { NewChaptersDto } from './dto/new-chapters.dto';
import { ChaptersDto } from './dto/chapters.dto';

@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly chaptersService: ChaptersService
  ) {}

  @Post()
  async create(@Body() newChapters: NewChaptersDto): Promise<ChaptersDto> {
    return this.chaptersService.create(newChapters);
  };

  @Patch(':from/:to')
  async swapOrders(@Param('from') from: number, @Param('to') to: number): Promise<void> {
    this.chaptersService.swapOrders(from, to);
  };
};
