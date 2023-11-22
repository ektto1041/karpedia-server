import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "./comments.entity";
import { PostsService } from "src/posts/posts.service";
import { NewCommentsDto } from "./dto/new-comments.dto";
import { UsersService } from "src/users/users.service";
import { CommentsWithPublicUsersWithReplyToDto } from "./dto/comments-with-public-users-with-reply-to.dto";
import { NewCommentsUpdateDto } from "./dto/new-comments-update.dto";
import { MailService } from "src/mail/mail.service";
import { CommentsByUsersDto } from "./dto/comments-by-users.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly mailService: MailService,
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

    const savedComments = await this.commentsRepository.save(comments);

    this.mailService.newCommentsAlarm(foundPosts.title);

    return savedComments
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

  async findAllByUsersId(usersId: number): Promise<CommentsByUsersDto[]> {
    const result = await this.commentsRepository.createQueryBuilder('Comments')
      .leftJoin('Comments.posts', 'Posts')
      .leftJoin('Posts.chapters', 'Chapters')
      .leftJoin('Comments.replyTo', 'ReplyTo')
      .select('Comments.id', 'id')
      .addSelect('Comments.content', 'content')
      .addSelect('Comments.modifiedAt', 'modifiedAt')
      .addSelect('Posts.id', 'postId')
      .addSelect('Posts.title', 'postTitle')
      .addSelect('Chapters.id', 'chapterId')
      .addSelect('Chapters.topics.id', 'topicId')
      .addSelect('ReplyTo.id', 'replyTo')
      .where({ users: {id: usersId} })
      .getRawMany<CommentsByUsersDto>();

    return result;
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