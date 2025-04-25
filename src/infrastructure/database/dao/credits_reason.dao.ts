import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { CreditsReason } from "src/credits-reason/entities/credits-reason.entity";



Injectable()
export class CreditsReasonDao {

    constructor(
        @InjectRepository(CreditsReason)
        private creditsReasonRepository: Repository<CreditsReason>,
    ) { }

    async createCreditsReason(createCreditsReasonDto) {
        try {
            const creditsReason = await this.creditsReasonRepository.create({
                ...createCreditsReasonDto,
                crs_create: new Date(),
            })

            return await this.creditsReasonRepository.save(creditsReason, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getCreditsReasonById(crsID: number) {
        try {
            const creditsReason = await this.creditsReasonRepository.findOne({
                where: {
                    crs_id: crsID,
                    crs_delete: IsNull()
                }     
            })

            return creditsReason

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllCreditsReason() {
        try {
            const creditsReason = await this.creditsReasonRepository.find({
                where: {
                    crs_delete: IsNull()
                }
            })

            return creditsReason

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteCreditsReason(crsID: number) {
        return await this.creditsReasonRepository
            .update({ crs_id: crsID }, {
                crs_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Razon de credito eliminado satisfactoriamente',
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

    async updateCreditsReason(crsID: number, updateCreditsReasonDto) {

        return await this.creditsReasonRepository
            .update(
                { crs_id: crsID },
                updateCreditsReasonDto
            )
            .then(() => {
                return {
                    message: 'Razon de credito actualizado satisfactoriamente',
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