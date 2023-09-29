import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "src/users/entities/users.entity";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1500 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToOne(() => Users, (users) => users.id)
  users: Users;

  @ManyToOne(() => Comments, comments => comments.id)
  replyTo: Comments;

  @OneToMany(() => Comments, comments => comments.replyTo)
  replies: Comments[];
}
