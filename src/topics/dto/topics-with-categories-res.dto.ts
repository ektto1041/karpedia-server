import { CategoriesDto } from "src/categories/dto/categories.dto";
import { TopicsWithCategoriesIdDto } from "./topics-with-categories-id.dto";

export class TopicsWithCategoriesResDto {
  categories: CategoriesDto[];
  topics: TopicsWithCategoriesIdDto[];
}