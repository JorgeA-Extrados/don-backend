import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Experience } from 'src/experiences/entities/experience.entity';
import { CategoryDao } from 'src/infrastructure/database/dao/categories.dao';

@Module({
    imports:[TypeOrmModule.forFeature([Category, Experience])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryDao],
})
export class CategoriesModule {}
