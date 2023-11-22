import { TopicsWithCategoriesNameDto } from "./topics-with-categories-name.dto";

export class SubscribedTopicsResultDto {
  isSubscribedTopicsAlarmAllowed: boolean;
  topics: TopicsWithCategoriesNameDto[];
}