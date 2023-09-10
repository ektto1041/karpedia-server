import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapters } from './chapters.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chapters])],
  controllers: [ChaptersController],
  providers: [ChaptersService]
})
export class ChaptersModule {}
