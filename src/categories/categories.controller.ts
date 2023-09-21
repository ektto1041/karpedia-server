import { Body, Controller, Delete, Param, Patch, Post, Put } from '@nestjs/common';
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

  @Patch(':from/:to')
  async swapOrders(@Param('from') from: number, @Param('to') to: number): Promise<void> {
    await this.categoriesService.swapOrders(from, to);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.categoriesService.delete(id);
  }
}
