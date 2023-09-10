import { Posts } from "src/posts/entities/posts.entity";
import { Topics } from "src/topics/topics.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chapters {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Topics, (topics) => topics.id)
  topics: Topics;

  @OneToMany(() => Posts, posts => posts.chapters)
  postsList: Posts[];
}