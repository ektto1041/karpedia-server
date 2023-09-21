import { Categories } from "src/categories/entities/categories.entity";
import { Chapters } from "src/chapters/chapters.entity";
import { Users } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TopicsDto } from "./dto/topics.dto";
import { NewTopicsDto } from "./dto/new-topics.dto";

@Entity()
export class Topics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  orders: number;

  @ManyToOne(() => Users, (users) => users.id)
  users: Users;

  @ManyToOne(() => Categories, (categories) => categories.id, { onDelete: 'CASCADE' })
  categories: Categories;

  @OneToMany(() => Chapters, chapters => chapters.topics)
  chaptersList: Chapters[];

  /**
   * Methods
   */
  toTopicsDto() {
    return new TopicsDto(this. id, this.name, this.description, this.orders);
  }

  static fromNewTopicsDto(newTopicsDto: NewTopicsDto) {
    const topics: Topics = new Topics();
    topics.name = newTopicsDto.name;
    topics.description = newTopicsDto.description;
    return topics;
  }

  update(topicsDto: TopicsDto) {
    this.name = topicsDto.name;
    this.description = topicsDto.description;
  }
}