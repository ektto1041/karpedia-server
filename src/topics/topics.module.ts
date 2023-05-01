import { Module } from "@nestjs/common";
import { Topics } from "./topics.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TopicsService } from "./topics.service";
import { TopicsController } from "./topics.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Topics])],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}