import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { PublicUsersDto } from "./dto/public-users.dto";
import { Topics } from "src/topics/topics.entity";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceId: string;

  @Column({ length: 320 })
  name: string;

  @Column({ length: 320 })
  email: string;

  @Column()
  profileImage: string;

  @Column()
  refreshToken: string;

  @Column()
  authority: number;

  @Column('tinyint')
  isSubscribedTopicsAlarmAllowed: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToMany(() => Topics, topics => topics.subscribedUsers)
  @JoinTable()
  subscribedTopics: Topics[];

  // methods
  static create(createUserDto: CreateUserDto): Users {
    const newUsers = new Users();
    newUsers.serviceId = createUserDto.serviceId;
    newUsers.name = createUserDto.name;
    newUsers.email = createUserDto.name;
    newUsers.profileImage = createUserDto.profileImage;
    newUsers.refreshToken = createUserDto.refreshToken;
    newUsers.authority = 0;
    return newUsers;
  }

  toPublicUsersDto(): PublicUsersDto {
    const publicUsers = new PublicUsersDto();
    publicUsers.id = this.id;
    publicUsers.name = this.name;
    publicUsers.email = this.email;
    publicUsers.profileImage = this.profileImage;

    return publicUsers;
  }
}
