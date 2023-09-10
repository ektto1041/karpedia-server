import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDto } from './dto/categories.dto';
import { NewCategoriesDto } from './dto/new-categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() newCategories: NewCategoriesDto) {
    return await this.categoriesService.create(newCategories);
  }

  @Put()
  async update(@Body() newCategories: CategoriesDto) {
    return await this.categoriesService.update(newCategories);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.categoriesService.delete(id);
  }
}
