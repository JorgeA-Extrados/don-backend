import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Publication } from "src/publication/entities/publication.entity";
import { ReportReason } from "src/report-reason/entities/report-reason.entity";



Injectable()
export class ReportReasonDao {

    constructor(
        @InjectRepository(ReportReason)
        private reportReasonRepository: Repository<ReportReason>,
    ) { }

    async createReportReason(createReportReasonDto) {
        try {
            const reportReason = await this.reportReasonRepository.create({
                ...createReportReasonDto,
                rea_create: new Date(),
            })

            return await this.reportReasonRepository.save(reportReason, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getReportReasonById(reaID: number) {
        try {
            const reportReason = await this.reportReasonRepository.findOne({
                where: {
                    rea_id: reaID,
                    rea_delete: IsNull()
                }     
            })

            return reportReason

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllReportReason() {
        try {
            const reportReason = await this.reportReasonRepository.find({
                where: {
                    rea_delete: IsNull()
                }
            })

            return reportReason

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteReportReason(reaID: number) {
        return await this.reportReasonRepository
            .update({ rea_id: reaID }, {
                rea_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Razon de reporte eliminado satisfactoriamente',
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

    async updateReportReason(reaID: number, updateReportReasonDto) {

        return await this.reportReasonRepository
            .update(
                { rea_id: reaID },
                updateReportReasonDto
            )
            .then(() => {
                return {
                    message: 'Razon de reporte actualizado satisfactoriamente',
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