import { Body, Controller, Get, Patch, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request } from "express";
import { PublicUsersDto } from "./dto/public-users.dto";
import { IdDto } from "src/dto/id.dto";
import { UpdateProfileImageDto } from "./dto/update-profile-image.dto";
import { UpdateNameDto } from "./dto/update-name.dto";
import { UpdateIsSubscribedTopicsAlarmAllowedDto } from "./dto/update-is-subscribed-topics-alarm-allowed.dto";

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

  @Get('subscribed/topics')
  async getSubscribedTopics(@Req() req: Request): Promise<IdDto[]> {
    const usersId: number = req.cookies.uid;

    return await this.usersService.getSubscribedTopics(usersId);
  }

  @Patch('image')
  async updateProfileImage(@Req() req: Request, @Body() newProfileImage: UpdateProfileImageDto): Promise<UpdateProfileImageDto> {
    const usersId: number = req.cookies.uid;

    try {
      await this.usersService.updateProfileImage(usersId, newProfileImage);
    } catch(error) {
      throw error;
    }

    return newProfileImage;
  }

  @Patch('name')
  async updateName(@Req() req: Request, @Body() newName: UpdateNameDto): Promise<UpdateNameDto> {
    const usersId: number = req.cookies.uid;

    try {
      await this.usersService.updateName(usersId, newName);
    } catch(error) {
      throw error;
    }

    return newName;
  }

  @Patch('is-subscribed-topics-alarm-allowed')
  async updateIsSubscribedTopicsAlarmAllowed(@Req() req: Request, @Body() newIsSubscribedTopicsAlarmAllowed: UpdateIsSubscribedTopicsAlarmAllowedDto): Promise<UpdateIsSubscribedTopicsAlarmAllowedDto> {
    const usersId: number = req.cookies.uid;

    try {
      await this.usersService.updateIsSubscribedTopicsAlarmAllowed(usersId, newIsSubscribedTopicsAlarmAllowed);
    } catch(error) {
      throw error;
    }

    return newIsSubscribedTopicsAlarmAllowed;
  }
}