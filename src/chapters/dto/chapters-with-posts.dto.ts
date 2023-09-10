import { PostsDto } from "src/posts/dto/posts.dto";

export class ChaptersWithPostsDto {
  id: number;
  title: string;
  content: string;
  postsList: PostsDto[];
}