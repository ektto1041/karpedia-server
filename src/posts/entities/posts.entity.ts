import { Comments } from "src/comments/comments.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreatePostDto } from "../dto/create-post.dto";
import { Topics } from "src/topics/topics.entity";
import { UpdatePostDto } from "../dto/update-post.dto";

@Entity()
export class Posts {
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
  static create(createPostsDto: CreatePostDto, topics: Topics[]): Posts {
    const newPost = new Posts();
    newPost.emoji = createPostsDto.emoji;
    newPost.title = createPostsDto.title;
    newPost.content = createPostsDto.content;
    newPost.status = 0;
    newPost.viewCount = 0;
    newPost.topics = topics;
    return newPost;
  }

  update(updatePostDto: UpdatePostDto, topics: Topics[]): void {
    this.emoji = updatePostDto.emoji;
    this.title = updatePostDto.title;
    this.content = updatePostDto.content;
    this.topics = topics;
  }

  delete(): void {
    this.status = 1;
  }
}
