import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, Res, Logger, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import {google} from 'googleapis';
import { AuthsService } from './auths.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auths')
export class AuthsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authsService: AuthsService,
    private readonly usersService: UsersService,
  ) {}

  oauth2Client = new google.auth.OAuth2(
    this.configService.get("GOOGLE_CLIENT_ID"),
    this.configService.get("GOOGLE_SECRET"),
    this.configService.get("GOOGLE_REDIRECT_URI"),
  );

  // Middleware 를 통해 로그인&어드민을 체크하는 API
  @Get('check')
  checkAuth() {}

  @Get('google')
  googleLogin(@Res() res: Response) {
    const scopes = [ 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email' ];

    const authrizationUrl: string = this.oauth2Client.generateAuthUrl({
      prompt: 'consent',
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
    });

    res.header('Cache-Control', 'no-cache');
    res.redirect(301, authrizationUrl);
  }

  @Get('google/callback')
  async googleCallback(@Res() res: Response, @Query('code') code: string) {
    const token = await this.oauth2Client.getToken(code);

    const isProd = this.configService.get('NODE_ENV') === 'prod';

    const newUsers: CreateUserDto = {
      serviceId: '',
      name: '',
      profileImage: '',
      refreshToken: '', 
    };

    const ob = this.authsService.getGoogleUserInfo(token.tokens.access_token);
    await ob.forEach(response => {
      newUsers.serviceId = response.data.id;
      newUsers.name = response.data.email;
      newUsers.profileImage = response.data.picture;
      newUsers.refreshToken = token.tokens.refresh_token;
    });

    const foundUsers = await this.usersService.findByServiceId(newUsers.serviceId);
    if(foundUsers) {
      foundUsers.refreshToken = newUsers.refreshToken;
      await this.usersService.update(foundUsers);
      res.cookie('uid', foundUsers.id, { domain: isProd ? '.karpedia.site' : undefined });

      // if admin
      if(foundUsers.authority === 1) res.cookie('is_admin', '1', { domain: isProd ? '.karpedia.site' : undefined });
    } else {
      const createdUsers = await this.usersService.create(newUsers);
      res.cookie('uid', createdUsers.id, { domain: isProd ? '.karpedia.site' : undefined });
    }
    
    res.cookie('at', token.tokens.access_token, { domain: isProd ? '.karpedia.site' : undefined });
    res.cookie('rt', token.tokens.refresh_token, { domain: isProd ? '.karpedia.site' : undefined });
    res.header('Cache-Control', 'no-cache');
    res.redirect(301, this.configService.get('CLIENT_URI'));
  }

  @Get('/logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    const at: string = req.cookies.at;

    const result = await this.oauth2Client.revokeToken(at);

    res.clearCookie('at');
    res.clearCookie('rt');
    res.clearCookie('uid');
    res.clearCookie('is_admin');

    res.status(200).send();
  }

  // 임시
  @Get('/testat')
  async testat(@Req() req: Request) {
    
  }
}
