import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  update(@Body() updatePostDto: UpdatePostDto, @Param('id') id: number) {
    return this.postsService.update(updatePostDto, id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.postsService.delete(id);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('paging')
  findAllPaging(@Query('page') page: number, @Query('keyword') keyword: string, @Query('topics') topics: string) {
    return this.postsService.findAllPaging({page, keyword, topics: topics ? topics.split(',') : []});
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Put('view/:id')
  viewPost(@Param('id') id: number) {
    return this.postsService.viewPost(id);
  }
}
