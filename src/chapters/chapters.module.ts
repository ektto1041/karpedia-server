import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapters } from './chapters.entity';
import { TopicsModule } from 'src/topics/topics.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chapters]), TopicsModule],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
