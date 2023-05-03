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

  @Get(':id/view')
  findOneView(@Param('id') id: number) {
    return this.postsService.findOneView(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postsService.remove(+id);
  // }
}
