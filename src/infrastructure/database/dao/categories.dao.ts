import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Experience } from "src/experiences/entities/experience.entity";
import { Category } from "src/categories/entities/category.entity";



Injectable()
export class CategoryDao {

    constructor(
        @InjectRepository(Experience)
        private experienceRepository: Repository<Experience>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async createCategory(createCategoryDto) {
        try {
            const category = await this.categoryRepository.create({
                ...createCategoryDto,
                cat_create: new Date(),
            })

            return await this.categoryRepository.save(category, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getCategoryById(catId: number) {
        try {
            const category = await this.categoryRepository.findOne({
                where: {
                    cat_id: catId,
                    cat_delete: IsNull()
                }
            })

            return category

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllCategory() {
        try {
            const category = await this.categoryRepository.find({
                where: {
                    cat_delete: IsNull()
                }
            })

            return category

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteCategory(catId: number) {
        return await this.categoryRepository
            .update({ cat_id: catId }, {
                cat_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Categoria eliminada satisfactoriamente',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Error Interno del Servidor',
                });
            });
    }

    async updateCategory(catId: number, updateCategoryDto) {

        return await this.categoryRepository
            .update(
                { cat_id: catId },
                updateCategoryDto
            )
            .then(() => {
                return {
                    message: 'Categoria actualizada satisfactoriamente',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Error Interno del Servidor',
                });
            });
    }

}