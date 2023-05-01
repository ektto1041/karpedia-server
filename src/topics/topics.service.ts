import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Topics } from "./topics.entity";
import { Repository } from "typeorm";

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topics)
    private topicsRepository: Repository<Topics>,
  ) {}

  async create(topicNames: string[]): Promise<Topics[]> {
    const newTopics: Topics[] = [];
    const topics: Topics[] = [];

    for(const topicName of topicNames) {
      const foundTopic: Topics = await this.topicsRepository.findOne({ where: {name: topicName}});

      console.log(foundTopic);

      if(foundTopic)
        topics.push(foundTopic);
      else
        newTopics.push(new Topics(topicName));
    }

    const savedTopics: Topics[] = await this.topicsRepository.save(newTopics);

    return [...topics, ...savedTopics];
  }

  findAll(): Promise<Topics[]> {
    return this.topicsRepository.find();
  }
}