export class CategoriesDto {
  constructor(id: number, name: string, orders: number) {
    this.id = id;
    this.name = name;
    this.orders = orders;
  }

  id: number;
  name: string;
  orders: number;
}