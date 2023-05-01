import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "./comments.entity";
import { CreateCommentsDto } from "./dto/create-comments.dto";
import { PostsService } from "src/posts/posts.service";
import { Posts } from "src/posts/entities/posts.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    private readonly postsService: PostsService,
  ) {}

  async create(createCommentsDto: CreateCommentsDto): Promise<Comments> {
    const foundPost: Posts = await this.postsService.findOne(createCommentsDto.postId);
    const newComments: Comments = new Comments(createCommentsDto, foundPost);
    
    return this.commentsRepository.save(newComments);
  }

  findAll(): Promise<Comments[]> {
    return this.commentsRepository.find({
      relations: ["post"],
    });
  }
}