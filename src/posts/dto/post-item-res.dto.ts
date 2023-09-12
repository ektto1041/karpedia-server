import { Posts } from "../posts.entity";
import { PostItemDto } from "./post-item.dto";

export class PostItemResDto {
  data: Posts[];
  maxPage: number;
}