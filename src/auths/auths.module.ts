import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthsController } from './auths.controller';
import { AuthsService } from './auths.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ConfigModule, HttpModule, UsersModule],
  controllers: [AuthsController],
  providers: [AuthsService],
  exports: [
    AuthsService,
  ]
})
export class AuthsModule {}