import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './comments.entity';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments]),
    PostsModule,
    UsersModule,
    MailModule,
  ],
  controllers: [
    CommentsController,
  ],
  providers: [
    CommentsService,
  ]
})
export class CommentsModule {}