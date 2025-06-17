import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Experience } from "src/experiences/entities/experience.entity";
import { Category } from "src/categories/entities/category.entity";



Injectable()
export class ExperienceDao {

    constructor(
        @InjectRepository(Experience)
        private experienceRepository: Repository<Experience>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }


    async createExperience(createExperienceDto) {
        try {
            const { cat_id, usr_id } = createExperienceDto

            const experience = await this.experienceRepository.create({
                ...createExperienceDto,
                exp_create: new Date(),
                cat_id: await this.categoryRepository.create({ cat_id }),
                usr_id: await this.userRepository.create({ usr_id })
            })

            return await this.experienceRepository.save(experience, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getExperienceById(expId: number) {
        try {
            const experience = await this.experienceRepository.findOne({
                where: {
                    exp_id: expId,
                    exp_delete: IsNull()
                }
            })

            return experience

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllExperience() {
        try {
            const experience = await this.experienceRepository.find({
                where: {
                    exp_delete: IsNull()
                }
            })

            return experience

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllExperienceByUserID(userId: number) {
        try {
            const experience = await this.experienceRepository.find({
                where: {
                    exp_delete: IsNull(),
                    usr_id: { usr_id: userId }
                }
            })

            return experience

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllExperienceDeleteByUserID(userId: number) {
        try {
            const experience = await this.experienceRepository.find({
                where: {
                    exp_delete: IsNull()
                }
            })

            return experience

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteExperience(expId: number) {
        return await this.experienceRepository
            .update({ exp_id: expId }, {
                exp_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Experiencia eliminada satisfactoriamente',
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

    async deleteExperiencePhysicsById(expId: number): Promise<void> {
        try {
            await this.experienceRepository.delete(expId);
        } catch (error) {
             throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async updateExperience(expId: number, updateExperienceDto) {

        return await this.experienceRepository
            .update(
                { exp_id: expId },
                updateExperienceDto
            )
            .then(() => {
                return {
                    message: 'Experiencia actualizada satisfactoriamente',
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