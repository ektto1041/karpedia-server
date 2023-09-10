import { CategoriesDto } from "src/categories/dto/categories.dto";
import { TopicsWithCategoriesDto } from "./topics-with-categories.dto";

export class TopicsWithCategoriesResDto {
  categories: CategoriesDto[];
  topics: TopicsWithCategoriesDto[];
}