import { Controller, Post, Body, Patch, Param, Get, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { NewPostsDto } from './dto/new-posts.dto';
import { PostsDto } from './dto/posts.dto';
import { UpdatePostsDto } from './dto/update-posts.dto';
import { ChaptersService } from 'src/chapters/chapters.service';
import { PostsWithChaptersIdDto } from './dto/posts-with-chapters-id.dto';
import { NewPostsUpdateDto } from './dto/new-posts-update.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly chaptersService: ChaptersService,
  ) {}

  @Post()
  async create(@Body() newPosts: NewPostsDto): Promise<PostsDto> {
    const posts = await this.postsService.create(newPosts);

    return posts.toPostsDto();
  };

  @Get('update/:id')
  async getUpdatePosts(@Param('id') id: number): Promise<UpdatePostsDto> {
    const foundPosts = await this.postsService.findOneWithChaptersWithTopicsById(id);
    const chaptersTitles = await this.chaptersService.findAllTitleByTopic(foundPosts.chapters.topics);
    const posts: PostsWithChaptersIdDto = {
      id: foundPosts.id,
      title: foundPosts.title,
      content: foundPosts.content,
      orders: foundPosts.orders,
      chaptersId: foundPosts.chapters.id,
    };

    return {
      chaptersList: chaptersTitles,
      posts: posts,
    };
  };

  @Put()
  async update(@Body() newPosts: NewPostsUpdateDto): Promise<PostsDto> {
    const savedPosts = await this.postsService.update(newPosts);

    return savedPosts.toPostsDto();
  };

  @Patch(':from/:to')
  async swapOrders(@Param('from') from: number, @Param('to') to: number): Promise<void> {
    await this.postsService.swapOrders(from, to);
  }
}
