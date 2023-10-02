import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { NewCommentsDto } from "./dto/new-comments.dto";
import { Request, Response } from "express";
import { CommentsWithPublicUsersDto } from "./dto/comments-with-public-users.dto";

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Get(':postId')
  async findAllWithPublicUsersByPostsId(@Param('postId') postsId: number): Promise<CommentsWithPublicUsersDto[]> {
    return await this.commentsService.findAllWithPublicUsersByPostsId(postsId);
  };

  @Post()
  async create(@Body() newComments: NewCommentsDto, @Req() req: Request, @Res() res: Response) {
    if(req.cookies.uid) {
      const comments = await this.commentsService.create(newComments, parseInt(req.cookies.uid));
      res.status(201).send(comments.toCommentsDto());
    } else {
      res.status(400).send();
    }
  }
}