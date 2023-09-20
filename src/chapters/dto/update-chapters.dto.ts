import { TopicsNameDto } from "src/topics/dto/topics-name.dto";
import { ChaptersWithTopicsIdDto } from "./chapters-with-topics-id.dto";

export class UpdateChaptersDto {
  topicsList: TopicsNameDto[];
  chapters: ChaptersWithTopicsIdDto;
};