import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateHeadingDto } from './dto/create-heading.dto';
import { UpdateHeadingDto } from './dto/update-heading.dto';
import { HeadingDao } from 'src/infrastructure/database/dao/heading.dao';

@Injectable()
export class HeadingService {

    constructor(
      private readonly headingDao: HeadingDao,
    ) { }


    async createHeading(createHeadingDto: CreateHeadingDto) {
  
      const heading = await this.headingDao.createHeading(createHeadingDto);
  
      return {
        message: 'Rubro',
        statusCode: HttpStatus.OK,
        data: heading,
      };
    }
  
    async getHeadingById(id: number) {
      try {
        const heading = await this.headingDao.getHeadingById(id);
  
        return {
          message: 'Rubro',
          statusCode: HttpStatus.OK,
          data: heading,
        };
      } catch (error) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${error.code} ${error.detail} ${error.message}`,
          error: `Error interno`,
        });
      }
    }
  
    async getAllHeading() {
      try {
        const heading = await this.headingDao.getAllHeading();
  
        return {
          message: 'Rubro',
          statusCode: HttpStatus.OK,
          data: heading,
        };
      } catch (error) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${error.code} ${error.detail} ${error.message}`,
          error: `Error interno`,
        });
      }
    }
  
    async deleteHeading(id) {
      const heading = await this.headingDao.getHeadingById(id)
  
      if (!heading) {
        throw new UnauthorizedException('Rubro no encontrado')
      }
  
      await this.headingDao.deleteHeading(id)
  
      return {
        message: 'Rubro eliminado',
        statusCode: HttpStatus.OK,
      };
    }
  
    async updateHeading(id, updateHeadingDto: UpdateHeadingDto) {
      try {
        const heading = await this.headingDao.getHeadingById(id)
  
  
        if (!heading) {
          throw new UnauthorizedException('Rubro no encontrado')
        }
  
  
        await this.headingDao.updateHeading(id, updateHeadingDto)
  
        const newHeading = await this.headingDao.getHeadingById(id)
  
        return {
          message: 'Rubro actualizado',
          statusCode: HttpStatus.OK,
          data: newHeading
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
