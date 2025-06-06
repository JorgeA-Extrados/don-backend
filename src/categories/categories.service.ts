import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDao } from 'src/infrastructure/database/dao/categories.dao';

@Injectable()
export class CategoriesService {

  constructor(
    private readonly categoryDao: CategoryDao,
  ) { }


  async createCategory(createCategoryDto: CreateCategoryDto) {

    const category = await this.categoryDao.createCategory(createCategoryDto);

    return {
      message: 'Categoría',
      statusCode: HttpStatus.OK,
      data: category,
    };
  }

  async getCategoryById(id: number) {
    try {
      const category = await this.categoryDao.getCategoryById(id);


      if (!category) {
        throw new UnauthorizedException('Categoría no encontrada')
      }

      return {
        message: 'Categoría',
        statusCode: HttpStatus.OK,
        data: category,
      };
    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllCategory() {
    try {
      const category = await this.categoryDao.getAllCategory();


      if (category.length === 0) {
        throw new UnauthorizedException('Categoría no encontrada')
      }

      return {
        message: 'Categorías',
        statusCode: HttpStatus.OK,
        data: category,
      };
    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async deleteCategory(id) {
    try {
      const category = await this.categoryDao.getCategoryById(id)

      if (!category) {
        throw new UnauthorizedException('Categoría no encontrada')
      }

      await this.categoryDao.deleteCategory(id)

      return {
        message: 'Categoría eliminada',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async updateUser(id, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryDao.getCategoryById(id)


      if (!category) {
        throw new UnauthorizedException('Categoría no encontrada')
      }


      await this.categoryDao.updateCategory(id, updateCategoryDto)

      const newCategory = await this.categoryDao.getCategoryById(id)

      return {
        message: 'Categoría actualizada',
        statusCode: HttpStatus.OK,
        data: newCategory
      };

    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }



}
