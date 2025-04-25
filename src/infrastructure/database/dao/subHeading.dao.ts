import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Experience } from "src/experiences/entities/experience.entity";
import { Category } from "src/categories/entities/category.entity";
import { Heading } from "src/heading/entities/heading.entity";
import { SubHeading } from "src/sub-heading/entities/sub-heading.entity";



Injectable()
export class SubHeadingDao {

    constructor(
        @InjectRepository(SubHeading)
        private subHeadingRepository: Repository<SubHeading>,
        @InjectRepository(Heading)
        private headingRepository: Repository<Heading>,
    ) { }

    async createSubHeading(createSubHeadingDto) {
        try {
            const {hea_id} = createSubHeadingDto
            const subHeading = await this.subHeadingRepository.create({
                ...createSubHeadingDto,
                heading: await this.headingRepository.create({hea_id}),
                sbh_create: new Date(),
            })

            return await this.subHeadingRepository.save(subHeading, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getSubHeadingById(sbhId: number) {
        try {
            const subHeading = await this.subHeadingRepository.findOne({
                where: {
                    sbh_id: sbhId,
                    sbh_delete: IsNull()
                }, 
                relations: {
                    heading: true
                }
            })

            return subHeading

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllSubHeading() {
        try {
            const subHeading = await this.subHeadingRepository.find({
                where: {
                    sbh_delete: IsNull()
                }
            })

            return subHeading

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteSubHeading(sbhId: number) {
        return await this.subHeadingRepository
            .update({ sbh_id: sbhId }, {
                sbh_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Sub-rubro eliminado satisfactoriamente',
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

    async updateSubHeading(sbhId: number, updateSubHeadingDto) {

        return await this.subHeadingRepository
            .update(
                { sbh_id: sbhId },
                updateSubHeadingDto
            )
            .then(() => {
                return {
                    message: 'Sub-rubro actualizado satisfactoriamente',
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