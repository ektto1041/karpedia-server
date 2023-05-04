import { Controller, Get } from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { Topics } from "./topics.entity";

@Controller('topics')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
  ) {}

  @Get()
  findAll(): Promise<Topics[]> {
    return this.topicsService.findAll();
  }
}