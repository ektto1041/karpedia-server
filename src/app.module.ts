import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts/entities/posts.entity';
import { Topics } from './topics/topics.entity';
import { Comments } from './comments/comments.entity';
import { CommentsModule } from './comments/comments.module';
import { TopicsModule } from './topics/topics.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthsModule } from './auths/auths.module';
import { Users } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';

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
    entities: [Users, Posts, Topics, Comments],
    logging: true,
    // In Production, shoule be false
    synchronize: configService.get('NODE_ENV') === 'prod' ? false : true,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware)
        .forRoutes('*');
  }
}
