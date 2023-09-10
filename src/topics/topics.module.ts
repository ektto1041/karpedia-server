import { Module } from "@nestjs/common";
import { Topics } from "./topics.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TopicsService } from "./topics.service";
import { TopicsController } from "./topics.controller";
import { CategoriesModule } from "src/categories/categories.module";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Topics]), CategoriesModule, UsersModule],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}