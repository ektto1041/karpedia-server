import { Controller, Get, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request } from "express";
import { PublicUsersDto } from "./dto/public-users.dto";

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('self')
  async findSelf(@Req() req: Request): Promise<PublicUsersDto> {
    const usersId = parseInt(req.cookies.uid);

    const foundUsers = await this.usersService.findByUserId(usersId);

    return foundUsers.toPublicUsersDto();
  }
}