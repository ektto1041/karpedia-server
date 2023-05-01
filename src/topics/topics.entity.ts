import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Topics {
  constructor(name: string) {
    this.name = name;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}