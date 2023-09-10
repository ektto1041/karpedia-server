export class TopicsDto {
  constructor(id: number, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  id: number;
  name: string;
  description: string;
}