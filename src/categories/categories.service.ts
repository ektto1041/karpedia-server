import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Categories } from './entities/Categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesDto } from './dto/categories.dto';
import { NewCategoriesDto } from './dto/new-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>
  ) {}

  findAll() {
    return this.categoriesRepository.find();
  }

  async findById(id: number): Promise<Categories> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async create(newCategories: NewCategoriesDto): Promise<CategoriesDto> {
    const categories: Categories = Categories.fromNewCategoriesDto(newCategories);
    const savedCategories: Categories = await this.categoriesRepository.save(categories);
    return savedCategories.toCategoriesDto();
  }

  async update(newCategories: CategoriesDto): Promise<CategoriesDto> {
    const {id, name} = newCategories;

    // 1. find saved Categories
    const foundCategories = await this.categoriesRepository.findOne({ where: { id } })

    // 2. modify name
    foundCategories.name = name;

    // 3. save categories
    const savedCategories = await this.categoriesRepository.save(foundCategories);

    return savedCategories.toCategoriesDto();
  }

  async delete(id: number) {
    await this.categoriesRepository.delete({ id });
  }
}
