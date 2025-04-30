import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateReportReasonDto } from './dto/create-report-reason.dto';
import { UpdateReportReasonDto } from './dto/update-report-reason.dto';
import { ReportReasonDao } from 'src/infrastructure/database/dao/reportReason.dao';

@Injectable()
export class ReportReasonService {


  constructor(
    private readonly reportReasonDao: ReportReasonDao,
  ) { }

  async createReportReason(createReportReasonDto: CreateReportReasonDto) {

    const reportReason = await this.reportReasonDao.createReportReason(createReportReasonDto);

    return {
      message: 'Razón de reporte',
      statusCode: HttpStatus.OK,
      data: reportReason,
    };
  }


  async getReportReasonById(id: number) {
    try {
      const reportReason = await this.reportReasonDao.getReportReasonById(id);

      if (!reportReason) {
        return {
          message: 'Razón de reporte no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Razón de reporte',
        statusCode: HttpStatus.OK,
        data: reportReason,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllReportReason() {
    try {
      const reportReason = await this.reportReasonDao.getAllReportReason();

      if (reportReason.length === 0) {
        return {
          message: 'Razón de reporte no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Razones de reportes',
        statusCode: HttpStatus.OK,
        data: reportReason,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async deleteReportReason(id) {
    try {
      const reportReason = await this.reportReasonDao.getReportReasonById(id)

      if (!reportReason) {
        return {
          message: 'Razón de reporte no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.reportReasonDao.deleteReportReason(id)

      return {
        message: 'Razón de reporte eliminado',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async updateReportReason(id, updateReportReasonDto: UpdateReportReasonDto) {
    try {
      const reportReason = await this.reportReasonDao.getReportReasonById(id)


      if (!reportReason) {
        return {
          message: 'Razón de reporte no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.reportReasonDao.updateReportReason(id, updateReportReasonDto)

      const newReportReason = await this.reportReasonDao.getReportReasonById(id)

      return {
        message: 'Razón de reporte actualizado',
        statusCode: HttpStatus.OK,
        data: newReportReason
      };

    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }
}
