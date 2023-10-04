import { PublicUsersDto } from "src/users/dto/public-users.dto";
import { CommentsWithPublicUsersDto } from "./comments-with-public-users.dto";

export class CommentsWithPublicUsersWithReplyToDto {
  id: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  users: PublicUsersDto;
  replyTo: CommentsWithPublicUsersDto | null;
};