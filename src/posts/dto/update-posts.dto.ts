import { ChaptersTitleDto } from "src/chapters/dto/chapters-title.dto";
import { PostsWithChaptersIdDto } from "./posts-with-chapters-id.dto";

export class UpdatePostsDto {
  chaptersList: ChaptersTitleDto[];
  posts: PostsWithChaptersIdDto;
};