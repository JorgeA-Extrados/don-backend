import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCreditsDonDto } from './dto/create-credits-don.dto';
import { UpdateCreditsDonDto } from './dto/update-credits-don.dto';
import { CreditsDonDao } from 'src/infrastructure/database/dao/credits_don.dao';

@Injectable()
export class CreditsDonService {
  constructor(
    private readonly creditsDonDao: CreditsDonDao,
  ) { }

  async createCreditsDON(createCreditsDonDto: CreateCreditsDonDto) {

    const { cre_amount } = createCreditsDonDto

    if (cre_amount <= 0) {
      throw new UnauthorizedException('La cantidad de Creditos DON debe ser mayor a 0')
    }

    const creditsDon = await this.creditsDonDao.createCreditsDON(createCreditsDonDto);

    return {
      message: 'Credito DON',
      statusCode: HttpStatus.OK,
      data: creditsDon,
    };
  }

  async getCreditsDonById(id: number) {
    try {
      const creditsDon = await this.creditsDonDao.getCreditsDonById(id);

      if (!creditsDon) {
        throw new UnauthorizedException('Credito DON no encontrada')
      }

      return {
        message: 'Credtio DON',
        statusCode: HttpStatus.OK,
        data: creditsDon,
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

  async getCreditsDonByUsrId(id: number) {
    try {
      const creditsDon = await this.creditsDonDao.getCreditsDonByUsrId(id);

      if (creditsDon.historial.length === 0) {
        throw new UnauthorizedException('El usuario no existe o no posee créditos DON');
      }

      return {
        message: 'Historial de Credito DON',
        statusCode: HttpStatus.OK,
        data: creditsDon,
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

  async getCreditsDonTotalByUsrId(id: number) {
    try {
      const creditsDon = await this.creditsDonDao.getCreditsDonTotalByUsrId(id);

      if (creditsDon.total === 0) {
        return {
          message: 'El usuario no existe o no posee créditos DON',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Total de Creditos DON',
        statusCode: HttpStatus.OK,
        data: creditsDon,
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

  async getAllCreditsDon() {
    try {
      const creditsDon = await this.creditsDonDao.getAllCreditsDon();

      if (creditsDon.length === 0) {
        throw new UnauthorizedException('Credito DON no encontradas')
      }

      return {
        message: 'Creditos DON',
        statusCode: HttpStatus.OK,
        data: creditsDon,
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

  async deleteCreditsDon(id) {
    try {
      const creditsDon = await this.creditsDonDao.getCreditsDonById(id)

      if (!creditsDon) {
        throw new UnauthorizedException('Credito DON no encontrado')
      }

      await this.creditsDonDao.deleteCreditsDon(id)

      return {
        message: 'Credito DON eliminada',
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

  async updateCreditsDon(id, updateCreditsDonDto: UpdateCreditsDonDto) {
    try {
      const creditsDon = await this.creditsDonDao.getCreditsDonById(id)


      if (!creditsDon) {
        throw new UnauthorizedException('Credito DON no encontrada')
      }

      await this.creditsDonDao.updateCreditsDon(id, updateCreditsDonDto)

      const newCreditsDON = await this.creditsDonDao.getCreditsDonById(id)

      return {
        message: 'Credito DON actualizado',
        statusCode: HttpStatus.OK,
        data: newCreditsDON
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
