import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSubHeadingDto } from './dto/create-sub-heading.dto';
import { UpdateSubHeadingDto } from './dto/update-sub-heading.dto';
import { SubHeadingDao } from 'src/infrastructure/database/dao/subHeading.dao';

@Injectable()
export class SubHeadingService {

  constructor(
    private readonly subHeadingDao: SubHeadingDao,
  ) { }


  async createSubHeading(createSubHeadingDto: CreateSubHeadingDto) {

    const SubHeading = await this.subHeadingDao.createSubHeading(createSubHeadingDto);

    return {
      message: 'Sub-rubro',
      statusCode: HttpStatus.OK,
      data: SubHeading,
    };
  }

  async getSubHeadingById(id: number) {
    try {
      const subHeading = await this.subHeadingDao.getSubHeadingById(id);

      return {
        message: 'Sub-rubro',
        statusCode: HttpStatus.OK,
        data: subHeading,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllSubHeading() {
    try {
      const subHeading = await this.subHeadingDao.getAllSubHeading();

      if (subHeading.length === 0) {
        throw new UnauthorizedException('Sub-rubro no encontrado')
      }

      return {
        message: 'Sub-rubro',
        statusCode: HttpStatus.OK,
        data: subHeading,
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

  async deleteSubHeading(id) {
    try {
      const subHeading = await this.subHeadingDao.getSubHeadingById(id)

      if (!subHeading) {
        throw new UnauthorizedException('Sub-rubro no encontrado')
      }

      await this.subHeadingDao.deleteSubHeading(id)

      return {
        message: 'Sub-rubro eliminado',
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

  async updateSubHeading(id, updateSubHeadingDto: UpdateSubHeadingDto) {
    try {
      const subHeading = await this.subHeadingDao.getSubHeadingById(id)


      if (!subHeading) {
        throw new UnauthorizedException('Sub-rubro no encontrado')
      }


      await this.subHeadingDao.updateSubHeading(id, updateSubHeadingDto)

      const newSubHeading = await this.subHeadingDao.getSubHeadingById(id)

      return {
        message: 'Sub-rubro actualizado',
        statusCode: HttpStatus.OK,
        data: newSubHeading
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
