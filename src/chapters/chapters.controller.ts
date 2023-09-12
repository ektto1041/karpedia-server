import { Body, Controller, Post } from '@nestjs/common';
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
};
