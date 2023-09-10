import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const uid: number = req.cookies.uid;
    const isAdmin = req.cookies.is_admin;

    if(isAdmin) {
      // 1. Check is_admin value
      if(isAdmin === '1') {
        // 2. Check is Users admin
        const foundUsers = await this.usersService.findByUserId(uid);
        if(foundUsers.authority === 1) {
          next();
          return;
        }
      } 
    }
    res.status(400);
    res.send();
  }
}