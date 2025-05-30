import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get('getAll')
  // @UseGuards(JwtAuthGuard)
  getAllCategory() {
    return this.categoriesService.getAllCategory();
  }

  @Get('byId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(+id);
  }


  @Patch('delete/:id')
  // @UseGuards(JwtAuthGuard)
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(+id);
  }

  @Patch('update/:id')
  // @UseGuards(JwtAuthGuard)
  updateUser(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateUser(+id, updateCategoryDto);
  }
}
