import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chapters } from "src/chapters/chapters.entity";
import { NewPostsDto } from "./dto/new-posts.dto";
import { PostsDto } from "./dto/posts.dto";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  status: number;
  // 0 is open, 1 is hide

  @Column()
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  // @OneToMany(() => Comments, comment => comment.post)
  // comments: Comments[];

  @ManyToOne(() => Chapters, chapters => chapters.id, { onDelete: 'CASCADE' })
  chapters: Chapters;

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
