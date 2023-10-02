import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { And, ArrayContains, DataSource, DeleteResult, In, Like, QueryBuilder, Repository, SelectQueryBuilder, Transaction, UpdateResult } from 'typeorm';
import { Users } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';

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

  async findByServiceId(serviceId: string) {
    return await this.usersRepository.findOneBy({ serviceId });
  }

  async findByUserId(userId: number): Promise<Users> {
    return await this.usersRepository.findOneBy({ id: userId });
  }
}
