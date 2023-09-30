import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "./comments.entity";
import { PostsService } from "src/posts/posts.service";
import { CommentsDto } from "./dto/comments.dto";
import { NewCommentsDto } from "./dto/new-comments.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  async create(newComments: NewCommentsDto, usersId: number): Promise<Comments> {
    const comments = Comments.fromNewCommentsDto(newComments);

    // users
    const foundUsers = await this.usersService.findByUserId(usersId);
    comments.users = foundUsers;

    // posts
    const foundPosts = await this.postsService.findById(newComments.postsId);
    comments.posts = foundPosts;

    // replyTo
    if(newComments.replyToId) {
      const foundComments = await this.commentsRepository.findOne({
        where: { id: newComments.replyToId },
      });

      comments.replyTo = foundComments;
    } 

    return await this.commentsRepository.save(comments);
  }
}