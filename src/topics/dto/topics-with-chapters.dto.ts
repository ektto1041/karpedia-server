import { ChaptersWithPostsDto } from "src/chapters/dto/chapters-with-posts.dto";
import { PublicUsersDto } from "src/users/dto/public-users.dto";

export class TopicsWithChaptersDto {
  id: number;
  name: string;
  description: string;
  orders: number;
  chaptersList: ChaptersWithPostsDto[];
  users: PublicUsersDto;
};