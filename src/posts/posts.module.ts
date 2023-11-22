import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { TopicsModule } from 'src/topics/topics.module';
import { ChaptersModule } from 'src/chapters/chapters.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), ChaptersModule, TopicsModule, MailModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [
    PostsService,
  ]
})
export class PostsModule {}