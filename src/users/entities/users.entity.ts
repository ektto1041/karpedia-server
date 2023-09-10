import { Comments } from "src/comments/comments.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceId: string;

  @Column()
  name: string;

  @Column()
  profileImage: string;

  @Column()
  refreshToken: string;

  @Column()
  authority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  // methods
  static create(createUserDto: CreateUserDto): Users {
    const newUsers = new Users();
    newUsers.serviceId = createUserDto.serviceId;
    newUsers.name = createUserDto.name;
    newUsers.profileImage = createUserDto.profileImage;
    newUsers.refreshToken = createUserDto.refreshToken;
    newUsers.authority = 0;
    return newUsers;
  }
}
