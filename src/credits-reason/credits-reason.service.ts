import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCreditsReasonDto } from './dto/create-credits-reason.dto';
import { UpdateCreditsReasonDto } from './dto/update-credits-reason.dto';
import { CreditsReasonDao } from 'src/infrastructure/database/dao/credits_reason.dao';

@Injectable()
export class CreditsReasonService {
  constructor(
    private readonly creditsReasonDao: CreditsReasonDao,
  ) { }

  async createCreditsReason(createCreditsReasonDto: CreateCreditsReasonDto) {

    const creditsReason = await this.creditsReasonDao.createCreditsReason(createCreditsReasonDto);

    return {
      message: 'Razón de credito',
      statusCode: HttpStatus.OK,
      data: creditsReason,
    };
  }


  async getCreditsReasonById(id: number) {
    try {
      const creditsReason = await this.creditsReasonDao.getCreditsReasonById(id);

      if (!creditsReason) {
        throw new UnauthorizedException('Razón de credito no encontrado')
      }

      return {
        message: 'Razón de credito',
        statusCode: HttpStatus.OK,
        data: creditsReason,
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

  async getAllCreditsReason() {
    try {
      const creditsReason = await this.creditsReasonDao.getAllCreditsReason();

      if (creditsReason.length === 0) {
        throw new UnauthorizedException('Razón de credito no encontrados')
      }

      return {
        message: 'Razones de creditos',
        statusCode: HttpStatus.OK,
        data: creditsReason,
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

  async deleteCreditsReason(id) {
    try {
      const creditsReason = await this.creditsReasonDao.getCreditsReasonById(id)

      if (!creditsReason) {
        throw new UnauthorizedException('Razón de credito no encontrado')
      }

      await this.creditsReasonDao.deleteCreditsReason(id)

      return {
        message: 'Razón de credito eliminado',
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

  async updateCreditsReason(id, updateCreditsReasonDto: UpdateCreditsReasonDto) {
    try {
      const creditsReason = await this.creditsReasonDao.getCreditsReasonById(id)


      if (!creditsReason) {
        throw new UnauthorizedException('Razón de credito no encontrada')
      }

      await this.creditsReasonDao.updateCreditsReason(id, updateCreditsReasonDto)

      const newCreditsReason = await this.creditsReasonDao.getCreditsReasonById(id)

      return {
        message: 'Razón de credito actualizado',
        statusCode: HttpStatus.OK,
        data: newCreditsReason
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
