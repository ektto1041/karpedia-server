import { ChaptersDto } from "src/chapters/dto/chapters.dto";
import { PublicUsersDto } from "src/users/dto/public-users.dto";

export class TopicsWithChaptersDto {
  id: number;
  name: string;
  description: string;
  orders: number;
  chaptersList: ChaptersDto[];
  users: PublicUsersDto;
}