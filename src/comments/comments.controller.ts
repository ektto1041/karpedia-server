import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentsDto } from "./dto/create-comments.dto";
import { UpdateRepliesDto } from "./dto/update-replies.dto";

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  create(@Body() createCommentsDto: CreateCommentsDto) {
    return this.commentsService.create(createCommentsDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Put('/reply/:id')
  updateReply(@Body() UpdateRepliesDto: UpdateRepliesDto, @Param('id') id: number) {
    return this.commentsService.updateReply(UpdateRepliesDto, id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.commentsService.delete(id);
  }
}