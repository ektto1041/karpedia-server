import { Posts } from "src/posts/entities/posts.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreateCommentsDto } from "./dto/create-comments.dto";

@Entity()
export class Comments {
  constructor(createCommentsDto: CreateCommentsDto, post: Posts) {
    if(createCommentsDto) {
      this.name = createCommentsDto.name;
      this.password = createCommentsDto.password;
      this.content = createCommentsDto.content;
      this.reply = '';
      this.status = 0;
      this.post = post;
    }
  }

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
}
