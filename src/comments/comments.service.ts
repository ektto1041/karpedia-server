import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "./comments.entity";
import { PostsService } from "src/posts/posts.service";
import { NewCommentsDto } from "./dto/new-comments.dto";
import { UsersService } from "src/users/users.service";
import { CommentsWithPublicUsersWithReplyToDto } from "./dto/comments-with-public-users-with-reply-to.dto";
import { NewCommentsUpdateDto } from "./dto/new-comments-update.dto";

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
    const foundPosts = await this.postsService.findOneById(newComments.postsId);
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

  async findAllWithPublicUsersWithReplyToByPostsId(postsId: number): Promise<CommentsWithPublicUsersWithReplyToDto[]> {
    return await this.commentsRepository.find({
      relations: ['users', 'replyTo', 'replyTo.users'],
      where: { posts: {id: postsId} },
      select: {
        users: {id: true, name: true, profileImage: true},
        replyTo: {id: true, content: true, createdAt: true, modifiedAt: true, users: {id: true, name: true, profileImage: true}}
      },
    });
  }

  async update(newComments: NewCommentsUpdateDto): Promise<Comments> {
    const foundComments = await this.commentsRepository.findOne({
      where: {id: newComments.id},
    });

    foundComments.content = newComments.content;

    return await this.commentsRepository.save(foundComments);
  }

  async delete(id: number): Promise<void> {
    await this.commentsRepository.delete({ id });
  }
}