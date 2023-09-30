import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "src/users/entities/users.entity";
import { NewCommentsDto } from "./dto/new-comments.dto";
import { CommentsDto } from "./dto/comments.dto";
import { Posts } from "src/posts/posts.entity";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1500 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToOne(() => Posts, posts => posts.id)
  posts: Posts;

  @ManyToOne(() => Users, (users) => users.id)
  users: Users;

  @ManyToOne(() => Comments, comments => comments.id)
  replyTo: Comments;

  @OneToMany(() => Comments, comments => comments.replyTo)
  replies: Comments[];

  /**
   * Methods
   */
  static fromNewCommentsDto(newComments: NewCommentsDto): Comments {
    const comments = new Comments();
    comments.content = newComments.content;
    return comments;
  };

  toCommentsDto(): CommentsDto {
    const commentsDto = new CommentsDto();
    commentsDto.id = this.id;
    commentsDto.content = this.content;
    commentsDto.createdAt = this.createdAt;
    commentsDto.modifiedAt = this.modifiedAt;

    return commentsDto;
  }
}
