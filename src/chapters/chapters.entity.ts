import { Posts } from "src/posts/posts.entity";
import { Topics } from "src/topics/topics.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { NewChaptersDto } from "./dto/new-chapters.dto";
import { ChaptersDto } from "./dto/chapters.dto";

@Entity()
export class Chapters {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Topics, (topics) => topics.id, { onDelete: 'CASCADE' })
  topics: Topics;

  @OneToMany(() => Posts, posts => posts.chapters)
  postsList: Posts[];

  /**
   * Methods
   */
  toChaptersDto(): ChaptersDto {
    const chaptersDto = new ChaptersDto();
    chaptersDto.id = this.id;
    chaptersDto.title = this.title;
    chaptersDto.content = this.content;

    return chaptersDto;
  };

  static fromNewChaptersDto(newChaptersDto: NewChaptersDto): Chapters {
    const chapters = new Chapters();
    chapters.title = newChaptersDto.title;
    chapters.content = newChaptersDto.content;
    return chapters;
  };
}