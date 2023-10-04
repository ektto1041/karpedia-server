import { PublicUsersDto } from "src/users/dto/public-users.dto";

export class CommentsWithPublicUsersDto {
  id: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  users: PublicUsersDto;
};