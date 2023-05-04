import { Posts } from "src/posts/entities/posts.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreateCommentsDto } from "./dto/create-comments.dto";
import { repl } from "@nestjs/core";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  content: string;

  @Column()
  reply: string;

  @Column({type: 'integer', width: 1})
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToOne(() => Posts, post => post.comments)
  post: Posts;

  // methods
  static create(createCommentsDto: CreateCommentsDto, post: Posts): Comments {
    const newComment = new Comments();
    newComment.name = createCommentsDto.name;
    newComment.password = createCommentsDto.password;
    newComment.content = createCommentsDto.content;
    newComment.reply = '';
    newComment.status = 0;
    newComment.post = post;
    return newComment;
  }

  updateReply(reply: string): void {
    this.reply = reply;
  }

  delete(): void {
    this.status = 1;
  }
}
