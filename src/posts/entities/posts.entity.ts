import { Comments } from "src/comments/comments.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreatePostDto } from "../dto/create-post.dto";
import { Topics } from "src/topics/topics.entity";
import { UpdatePostDto } from "../dto/update-post.dto";

@Entity()
export class Posts {
  constructor(createPostsDto: CreatePostDto, topics: Topics[]) {
    if(createPostsDto) {
      this.emoji = createPostsDto.emoji;
      this.title = createPostsDto.title;
      this.content = createPostsDto.content;
      this.status = 0;
      this.viewCount = 0;
      this.topics = topics;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 4})
  emoji: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  status: number;

  @Column()
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @OneToMany(() => Comments, comment => comment.post)
  comments: Comments[];

  @ManyToMany(() => Topics)
  @JoinTable()
  topics: Topics[];

  // methods
  update(updatePostDto: UpdatePostDto, topics: Topics[]) {
    this.emoji = updatePostDto.emoji;
    this.title = updatePostDto.title;
    this.content = updatePostDto.content;
    this.topics = topics;
  }

  delete() {
    this.status = 1;
  }
}