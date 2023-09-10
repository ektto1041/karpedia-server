import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

  @ManyToOne(() => Chapters, chapters => chapters.id, { onDelete: 'CASCADE' })
  chapters: Chapters;

  /**
   * Methods
   */
  delete(): void {
    this.status = 1;
  }
}
