import { DynamicModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts/posts.entity';
import { Topics } from './topics/topics.entity';
import { Comments } from './comments/comments.entity';
import { CommentsModule } from './comments/comments.module';
import { TopicsModule } from './topics/topics.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthsModule } from './auths/auths.module';
import { Users } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { Categories } from './categories/categories.entity';
import { ChaptersModule } from './chapters/chapters.module';
import { Chapters } from './chapters/chapters.entity';
import { AdminMiddleware } from './middleware/admin.middleware';

const typeOrmModule: DynamicModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [Users, Posts, Topics, Comments, Categories, Chapters],
    logging: true,
    // In Production, shoule be false
    synchronize: configService.get('NODE_ENV') === 'prod' ? false : false,
  })
})

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    typeOrmModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    TopicsModule,
    AuthsModule,
    CategoriesModule,
    ChaptersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware)
        .forRoutes(
          '/auths/check',
          { path: 'users/self', method: RequestMethod.GET },
          '/topics/setting',
          { path: 'categories', method: RequestMethod.POST },
          { path: 'categories', method: RequestMethod.PUT },
          { path: 'categories/:id', method: RequestMethod.DELETE },
          { path: 'topics', method: RequestMethod.POST },
          { path: 'topics', method: RequestMethod.PUT },
          { path: 'topics/:id', method: RequestMethod.DELETE },
          { path: 'chapters', method: RequestMethod.PUT },
          '/chapters/update/:id',
          { path: 'posts', method: RequestMethod.PUT },
          '/posts/update/:id',
          '/posts/:from/:to',
          { path: 'comments', method: RequestMethod.POST },
          { path: 'comments', method: RequestMethod.PUT },
          { path: 'comments/:id', method: RequestMethod.DELETE },
        )
        .apply(AdminMiddleware)
        .forRoutes(
          '/topics/setting',
          '/auths/check',
          { path: 'categories', method: RequestMethod.POST },
          { path: 'categories', method: RequestMethod.PUT },
          { path: 'categories/:id', method: RequestMethod.DELETE },
          { path: 'topics', method: RequestMethod.POST },
          { path: 'topics', method: RequestMethod.PUT },
          { path: 'topics/:id', method: RequestMethod.DELETE },
          { path: 'chapters', method: RequestMethod.PUT },
          '/chapters/update/:id',
          { path: 'posts', method: RequestMethod.PUT },
          '/posts/update/:id',
          '/posts/:from/:to',
        );
  }
}
