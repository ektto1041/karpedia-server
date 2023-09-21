export class TopicsDto {
  constructor(id: number, name: string, description: string, orders: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.orders = orders;
  }

  id: number;
  name: string;
  description: string;
  orders: number;
}