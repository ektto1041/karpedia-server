import { ChaptersWithPostsDto } from "src/chapters/dto/chapters-with-posts.dto";

export class TopicsWithChaptersDto {
  id: number;
  name: string;
  description: string;
  chaptersList: ChaptersWithPostsDto[];
}