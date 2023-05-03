import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "./comments.entity";
import { CreateCommentsDto } from "./dto/create-comments.dto";
import { PostsService } from "src/posts/posts.service";
import { Posts } from "src/posts/entities/posts.entity";
import { repl } from "@nestjs/core";
import { UpdateRepliesDto } from "./dto/update-replies.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    private readonly postsService: PostsService,
  ) {}

  async create(createCommentsDto: CreateCommentsDto): Promise<Comments> {
    const foundPost: Posts = await this.postsService.findOne(createCommentsDto.postId);
    const newComments: Comments = Comments.create(createCommentsDto, foundPost);
    
    return this.commentsRepository.save(newComments);
  }

  findAll(): Promise<Comments[]> {
    return this.commentsRepository.find({
      relations: ["post"],
    });
  }
  
  findAllByPostId(postId: number): Promise<Comments[]> {
    return this.commentsRepository.find({
      where: {post: {id: postId}},
      relations: ['post']
    });
  }

  async updateReply(updateRepliesDto: UpdateRepliesDto, id: number): Promise<Comments> {
    const foundComment = await this.commentsRepository.findOne({
      where: {id, status: 0},
    });

    if(!foundComment) throw new HttpException('NotFoundComment', HttpStatus.NOT_FOUND);

    foundComment.updateReply(updateRepliesDto.reply);

    return this.commentsRepository.save(foundComment);
  }

  async delete(id: number): Promise<Comments> {
    const foundComment = await this.commentsRepository.findOne({
      where: {id},
    });

    if(!foundComment) throw new HttpException('NotFoundComment', HttpStatus.NOT_FOUND);

    foundComment.delete();

    return this.commentsRepository.save(foundComment);
  }
}