export class CommentsByUsersDto {
  id: number;
  content: string;
  modifiedAt: Date;
  postTitle: string;
  replyTo: number | null;
}