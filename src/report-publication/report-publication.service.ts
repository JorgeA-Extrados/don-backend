import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateReportPublicationDto } from './dto/create-report-publication.dto';
import { UpdateReportPublicationDto } from './dto/update-report-publication.dto';
import { ReportPublicationDao } from 'src/infrastructure/database/dao/reportPublication.dao';
import { CreateChangeOfStateDto } from './dto/change-of-state.dto';
import { PublicationDao } from 'src/infrastructure/database/dao/publication.dao';
import { EmailRepository } from 'src/infrastructure/utils/email/email.repository';

@Injectable()
export class ReportPublicationService {
  constructor(
    private readonly reportPublicationDao: ReportPublicationDao,
    private readonly publicationDao: PublicationDao,
    private readonly emailRepository: EmailRepository,
  ) { }

  async createReportPublication(createReportPublicationDto: CreateReportPublicationDto) {

    const reportPublication = (await this.reportPublicationDao.createReportPublication(createReportPublicationDto));

    console.log('Type of reportPublication:', Array.isArray(reportPublication) ? 'array' : 'object');
    console.log(reportPublication);


    const report = await this.reportPublicationDao.getReportPublicationById(reportPublication.rep_id)

    const iso = report?.rep_create?.toISOString();

    const formattedDate = iso
      ? iso.replace('T', ' ').substring(0, 19) // Quita la T y el .000Z dejando solo "YYYY-MM-DD HH:mm:ss"
      : null;

    const emailReport = {
      pub_image: report?.publication.pub_image,
      pub_description: report?.publication.pub_description,
      rep_create: formattedDate,
      rea_reason: report?.reportReason.rea_reason
    }

    try {
      await this.emailRepository.reportPublicationEmail(emailReport);
    } catch (error) {
      throw new UnauthorizedException('Error al enviar el código de verificación.')
    }



    return {
      message: 'Reporte realizado con éxito.',
      statusCode: HttpStatus.OK,
      data: reportPublication,
    };
  }

  async getReportPublicationById(id: number) {
    try {
      const reportPublication = await this.reportPublicationDao.getReportPublicationById(id);

      if (!reportPublication) {
        return {
          message: 'Reporte de publicación no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Reporte Publicación',
        statusCode: HttpStatus.OK,
        data: reportPublication,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllReportPublication() {
    try {
      const reportPublication = await this.reportPublicationDao.getAllReportPublication();

      if (reportPublication.length === 0) {
        return {
          message: 'Reporte de publicación no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Reportes de publicaciones',
        statusCode: HttpStatus.OK,
        data: reportPublication,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async deleteReportPublication(id) {
    try {
      const reportPublication = await this.reportPublicationDao.getReportPublicationById(id)

      if (!reportPublication) {
        return {
          message: 'Reporte de publicación no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.reportPublicationDao.deleteReportPublication(id)

      return {
        message: 'Reporte de Publicación eliminada',
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

  async updateReportPublication(id, updateReportPublicationDto: UpdateReportPublicationDto) {
    try {
      const reportPublication = await this.reportPublicationDao.getReportPublicationById(id)

      if (!reportPublication) {
        return {
          message: 'Reporte de publicación no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.reportPublicationDao.updateReportPublication(id, updateReportPublicationDto)

      const newReportPublication = await this.reportPublicationDao.getReportPublicationById(id)

      return {
        message: 'Reporte de Publicación actualizado',
        statusCode: HttpStatus.OK,
        data: newReportPublication
      };

    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getReportPublicationByPUBID(id: number) {
    try {
      const reports = await this.reportPublicationDao.getReportPublicationByPUBID(id);

      if (!reports.length) {
        return {
          message: 'No tiene reportes esta publicación',
          statusCode: HttpStatus.NO_CONTENT,
          data: {
            pub_id: id,
            pub_image: null,
            totalReports: 0,
            reasons: [],
          },
        };
      }

      const { pub_id, pub_image } = reports[0].publication;

      const groupedReasons = new Map();

      for (const report of reports) {
        const { reportReason, rep_description, whoReported } = report;
        const reasonId = reportReason.rea_id;

        if (!groupedReasons.has(reasonId)) {
          groupedReasons.set(reasonId, {
            rea_id: reasonId,
            rea_reason: reportReason.rea_reason,
            count: 0,
            descriptions: [],
            reporters: [],
          });
        }

        const group = groupedReasons.get(reasonId);
        group.count += 1;
        group.descriptions.push(rep_description);
        group.reporters.push(whoReported);
      }

      const reasons = Array.from(groupedReasons.values()).sort(
        (a, b) => b.count - a.count
      );

      return {
        message: 'Reportes de una Publicación',
        statusCode: HttpStatus.OK,
        data: {
          pub_id,
          pub_image,
          totalReports: reports.length,
          reasons,
        },
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async updateReportsByAction(createChangeOfStateDto: CreateChangeOfStateDto) {
    try {
      const { pub_id, state, rea_id, reason } = createChangeOfStateDto

      if (state === 'aprobado') {
        const finalReason = {
          pub_reason_for_deletion: reason,
          pub_delete: new Date()
        }
        await this.publicationDao.updatePublication(pub_id, finalReason)
      }

      if (state === 'rechazado' && !rea_id) {
        throw new BadRequestException('rea_id es obligatorio cuando el estado es RECHAZADO');
      }

      const result = await this.reportPublicationDao.updateReportsByAction(pub_id, state, rea_id);

      return {
        message:
          state === 'rechazado'
            ? `Se rechazaron ${result.affected} reportes con el motivo ID ${rea_id} para la publicación ID ${pub_id}.`
            : `Se finalizaron ${result.affected} reportes de la publicación ID ${pub_id}.`,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message || 'Error al actualizar los reportes',
        error: 'Error Interno del Servidor',
      });
    }
  }

  async getAllPendingReportedPublications() {
    try {
      const reports = await this.reportPublicationDao.getAllPendingReportedPublications();

      return {
        message: 'Todas las publicaciones reportadas',
        statusCode: HttpStatus.OK,
        data: reports
      }
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message || 'Error al obtener publicaciones reportadas',
        error: 'Error Interno del Servidor',
      });
    }
  }


}
