import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { Observable } from 'rxjs';
import { And, ArrayContains, DataSource, DeleteResult, In, Like, QueryBuilder, Repository, SelectQueryBuilder, Transaction, UpdateResult } from 'typeorm';
import { Users } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IdDto } from 'src/dto/id.dto';
import { UpdateProfileImageDto } from './dto/update-profile-image.dto';
import { UpdateNameDto } from './dto/update-name.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(newUsers: CreateUserDto) {
    const users: Users = Users.create(newUsers);
    const savedUsers = await this.usersRepository.save(users);

    return savedUsers;
  }

  async update(newUsers: Users) {
    return await this.usersRepository.save(newUsers);
  }

  async updateProfileImage(usersId: number, newProfileImage: UpdateProfileImageDto): Promise<void> {
    const result = await this.usersRepository.createQueryBuilder('Users')
      .update(Users)
      .set({ profileImage: newProfileImage.profileImage })
      .where({ id: usersId })
      .execute();
    
    if(result.affected !== 1) throw new HttpException('Fail to update profile image', HttpStatus.BAD_REQUEST);
  }

  async updateName(usersId: number, newName: UpdateNameDto): Promise<void> {
    const hasName = await this.usersRepository.createQueryBuilder('Users')
      .select(['Users.id'])
      .where({ name: newName.name })
      .getCount();
    
    if(hasName === 1) throw new HttpException({code: 101, message: '중복된 이름이 존재합니다.'}, HttpStatus.BAD_REQUEST);

    const result = await this.usersRepository.createQueryBuilder('Users')
      .update(Users)
      .set({ name: newName.name })
      .where({ id: usersId })
      .execute();
    
    if(result.affected !== 1) throw new HttpException({code: 100, message: 'Fail to update username'}, HttpStatus.BAD_REQUEST);
  }

  async findByServiceId(serviceId: string) {
    return await this.usersRepository.findOneBy({ serviceId });
  }

  async findByUserId(userId: number): Promise<Users> {
    return await this.usersRepository.findOneBy({ id: userId });
  }

  async getSubscribedTopics(usersId: number): Promise<IdDto[]> {
    const foundUsers = await this.usersRepository.findOne({
      relations: { subscribedTopics: true },
      select: { subscribedTopics: { id: true} },
      where: { id: usersId },
    });

    return foundUsers.subscribedTopics;
  }
}
