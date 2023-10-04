import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { NewCommentsDto } from "./dto/new-comments.dto";
import { Request, Response } from "express";
import { CommentsWithPublicUsersWithReplyToDto } from "./dto/comments-with-public-users-with-reply-to.dto";
import { NewCommentsUpdateDto } from "./dto/new-comments-update.dto";
import { CommentsDto } from "./dto/comments.dto";

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Get(':postId')
  async findAllWithPublicUsersWithReplyToIdByPostsId(@Param('postId') postsId: number): Promise<CommentsWithPublicUsersWithReplyToDto[]> {
    return await this.commentsService.findAllWithPublicUsersWithReplyToByPostsId(postsId);
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

  @Put()
  async update(@Body() newComments: NewCommentsUpdateDto): Promise<CommentsDto> {
    return (await this.commentsService.update(newComments)).toCommentsDto();
  }
}