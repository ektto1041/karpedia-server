export class CommentsByUsersDto {
  id: number;
  content: string;
  modifiedAt: Date;
  postId: number;
  postTitle: string;
  chapterId: number;
  topicId: number;
  replyTo: number | null;
}