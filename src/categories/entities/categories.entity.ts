import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CategoriesDto } from "../dto/categories.dto";
import { NewCategoriesDto } from "../dto/new-categories.dto";

@Entity()
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  orders: number;

  // No Topics
  // 카테고리 이름만 가져오는 쿼리가 있기 때문

  /**
   * Methods
   */
  toCategoriesDto(): CategoriesDto {
    return new CategoriesDto(this.id, this.name);
  }

  static fromNewCategoriesDto(newCategoriesDto: NewCategoriesDto) {
    const categories: Categories = new Categories();
    categories.name = newCategoriesDto.name;
    return categories;
  }
}