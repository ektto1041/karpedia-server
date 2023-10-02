import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthsService } from "src/auths/auths.service";
import { Users } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authsService: AuthsService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.at;
    const refreshToken = req.cookies.rt;

    if(accessToken) {
      // 1. Verify Access Token
      const verifiedResult = await this.authsService.verifyAccessToken(accessToken);
      if(verifiedResult) next();
      else {
        // 2. Check RT in Cookie and RT in DB
        const foundUsers: Users = await this.usersService.findByUserId(req.cookies.uid);
        if(foundUsers.refreshToken !== refreshToken) {
          Logger.log('Refresh Token is invalid')

          res.clearCookie('uid');
          res.clearCookie('at');
          res.clearCookie('rt');

          res.status(400);
          res.send();
        } else {
          // 3. Refresh Access Token
          const newAccessToken = await this.authsService.refreshAccessToken(refreshToken);
          if(!newAccessToken) {
            Logger.log('Refresh Token is invalid')

            res.clearCookie('uid');
            res.clearCookie('at');
            res.clearCookie('rt');

            res.status(400);
            res.send();
          } else {
            // 4. New Access Token
            res.cookie('at', newAccessToken);

            next();
          }
        }
      }
    } else {
      res.status(400);
      res.send();
    }
  }
}