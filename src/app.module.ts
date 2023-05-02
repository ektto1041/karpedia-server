import { DynamicModule, Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts/entities/posts.entity';
import { Topics } from './topics/topics.entity';
import { Comments } from './comments/comments.entity';
import { CommentsModule } from './comments/comments.module';
import { TopicsModule } from './topics/topics.module';

const typeOrmModule: DynamicModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'karpedia_test',
  entities: [Posts, Topics, Comments],
  logging: true,
  // In Production, shoule be false
  synchronize: true,
})

@Module({
  imports: [
    typeOrmModule,
    PostsModule,
    CommentsModule,
    TopicsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
