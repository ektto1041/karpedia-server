import { ChaptersDto } from "src/chapters/dto/chapters.dto";
import { PostsDto } from "src/posts/dto/posts.dto";

export class TopicsWithOneChaptersWithOnePostsDto {
  id: number;
  name: string;
  description: string;
  orders: number;
  chapters: ChaptersDto;
  posts: PostsDto;

  static fromRaw(raw: TopicsWithOneChaptersWithOnePostsRaw): TopicsWithOneChaptersWithOnePostsDto {
    const chapters = new ChaptersDto();
    chapters.id = raw.chaptersId;
    chapters.title = raw.chaptersTitle;
    chapters.content = raw.chaptersContent;
    chapters.orders = raw.orders;

    const posts = new PostsDto();
    posts.id = raw.postsId;
    posts.title = raw.postsTitle;
    posts.content = raw.postsContent;
    posts.orders = raw.postsOrders;
    posts.status = raw.postsStatus;
    posts.viewCount = raw.postsViewCount;
    posts.createdAt = raw.postsCreatedAt;
    posts.modifiedAt = raw.postsModifiedAt;

    const result = new TopicsWithOneChaptersWithOnePostsDto();
    result.id = raw.id;
    result.name = raw.name;
    result.description = raw.description;
    result.orders = raw.orders;
    result.chapters = chapters;
    result.posts = posts;

    return result;
  }
};

export class TopicsWithOneChaptersWithOnePostsRaw {
  id: number;
  name: string;
  description: string;
  orders: number;
  chaptersId: number;
  chaptersTitle: string;
  chaptersContent: string;
  chaptersOrders: number;
  postsId: number;
  postsTitle: string;
  postsContent: string;
  postsOrders: number;
  postsStatus: number;
  postsViewCount: number;
  postsCreatedAt: Date;
  postsModifiedAt: Date;
};