import { Controller, Post, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { NewPostsDto } from './dto/new-posts.dto';
import { PostsDto } from './dto/posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() newPosts: NewPostsDto): Promise<PostsDto> {
    const posts = await this.postsService.create(newPosts);

    return posts.toPostsDto();
  };

  // @Put(':id')
  // update(@Body() updatePostDto: UpdatePostDto, @Param('id') id: number) {
  //   return this.postsService.update(updatePostDto, id);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: number) {
  //   return this.postsService.delete(id);
  // }

  // @Get()
  // findAll() {
  //   return this.postsService.findAll();
  // }

  // @Get('paging')
  // findAllPaging(@Query('page') page: number, @Query('keyword') keyword: string, @Query('topics') topics: string) {
  //   return this.postsService.findAllPaging({page, keyword, topics: topics ? topics.split(',') : []});
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.postsService.findOne(id);
  // }

  // @Put('view/:id')
  // viewPost(@Param('id') id: number) {
  //   return this.postsService.viewPost(id);
  // }
}
