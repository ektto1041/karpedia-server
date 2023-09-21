import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
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

  @Patch(':from/:to')
  async swapOrders(@Param('from') from: number, @Param('to') to: number): Promise<void> {
    await this.postsService.swapOrders(from, to);
  }
}
