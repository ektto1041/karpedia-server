import { ChaptersDto } from "src/chapters/dto/chapters.dto";

export class TopicsWithOneChaptersDto {
  id: number;
  name: string;
  description: string;
  orders: number;
  chapters: ChaptersDto | null;

  static fromRaw(raw: TopicsWithOneChaptersRaw): TopicsWithOneChaptersDto {
    const chapters = new ChaptersDto();
    chapters.id = raw.chaptersId;
    chapters.title = raw.chaptersTitle;
    chapters.content = raw.chaptersContent;
    chapters.orders = raw.orders;

    const result = new TopicsWithOneChaptersDto();
    result.id = raw.id;
    result.name = raw.name;
    result.description = raw.description;
    result.orders = raw.orders;
    result.chapters = chapters;

    return result;
  }
};

export class TopicsWithOneChaptersRaw {
  id: number;
  name: string;
  description: string;
  orders: number;
  chaptersId: number;
  chaptersTitle: string;
  chaptersContent: string;
  chaptersOrders: number;
};