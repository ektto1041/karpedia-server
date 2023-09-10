import { Comments } from "src/comments/comments.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreatePostDto } from "../dto/create-post.dto";
import { Topics } from "src/topics/topics.entity";
import { UpdatePostDto } from "../dto/update-post.dto";
import { Chapters } from "src/chapters/chapters.entity";

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

  @ManyToOne(() => Chapters, chapters => chapters.id)
  chapters: Chapters;

  /**
   * Methods
   */
  delete(): void {
    this.status = 1;
  }
}
