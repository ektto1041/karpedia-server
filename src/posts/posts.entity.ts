import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chapters } from "src/chapters/chapters.entity";
import { NewPostsDto } from "./dto/new-posts.dto";
import { PostsDto } from "./dto/posts.dto";
import { Comments } from "src/comments/comments.entity";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  orders: number;

  @Column()
  status: number;
  // 0 is open, 1 is hide

  @Column()
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToOne(() => Chapters, chapters => chapters.id, { onDelete: 'CASCADE' })
  chapters: Chapters;

  @OneToMany(() => Comments, comment => comment.posts)
  commentsList: Comments[];

  /**
   * Methods
   */
  delete(): void {
    this.status = 1;
  }

  toPostsDto(): PostsDto {
    const postsDto = new PostsDto();
    postsDto.id = this.id;
    postsDto.title = this.title;
    postsDto.content = this.content;
    postsDto.status = this.status;
    postsDto.viewCount = this.viewCount;
    postsDto.createdAt = this.createdAt;
    postsDto.modifiedAt = this.modifiedAt;
    postsDto.orders = this.orders;

    return postsDto;
  };

  static fromNewPostsDto(newPostsDto: NewPostsDto): Posts {
    const posts = new Posts();
    posts.title = newPostsDto.title;
    posts.content = newPostsDto.content;
    posts.status = 0;
    posts.viewCount = 0;

    return posts;
  };
};
