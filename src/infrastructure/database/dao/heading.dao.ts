import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Heading } from "src/heading/entities/heading.entity";



Injectable()
export class HeadingDao {

    constructor(
        @InjectRepository(Heading)
        private headingRepository: Repository<Heading>,
    ) { }

    async createHeading(createHeadingDto) {
        try {
            const heading = await this.headingRepository.create({
                ...createHeadingDto,
                hea_create: new Date(),
            })

            return await this.headingRepository.save(heading, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getHeadingById(heaId: number) {
        try {
            const heading = await this.headingRepository.findOne({
                where: {
                    hea_id: heaId,
                    hea_delete: IsNull()
                },
                relations: {
                    subHeading: true
                }
            })

            return heading

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllHeading() {
        try {
            const heading = await this.headingRepository.find({
                where: {
                    hea_delete: IsNull()
                },
                relations: {
                    subHeading: true
                },
                order: {
                    hea_name: 'ASC',
                },
            })

            return heading

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteHeading(heaId: number) {
        return await this.headingRepository
            .update({ hea_id: heaId }, {
                hea_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Rubro eliminado satisfactoriamente',
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

    async updateHeading(heaId: number, updateHeadingDto) {

        return await this.headingRepository
            .update(
                { hea_id: heaId },
                updateHeadingDto
            )
            .then(() => {
                return {
                    message: 'Rubro actualizado satisfactoriamente',
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