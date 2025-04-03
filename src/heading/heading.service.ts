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
        message: 'Heading',
        statusCode: HttpStatus.OK,
        data: heading,
      };
    }
  
    async getHeadingById(id: number) {
      try {
        const heading = await this.headingDao.getHeadingById(id);
  
        return {
          message: 'Heading',
          statusCode: HttpStatus.OK,
          data: heading,
        };
      } catch (error) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${error.code} ${error.detail} ${error.message}`,
          error: `Internal Error`,
        });
      }
    }
  
    async getAllHeading() {
      try {
        const heading = await this.headingDao.getAllHeading();
  
        return {
          message: 'Heading',
          statusCode: HttpStatus.OK,
          data: heading,
        };
      } catch (error) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${error.code} ${error.detail} ${error.message}`,
          error: `Internal Error`,
        });
      }
    }
  
    async deleteHeading(id) {
      const heading = await this.headingDao.getHeadingById(id)
  
      if (!heading) {
        throw new UnauthorizedException('Heading not fount')
      }
  
      await this.headingDao.deleteHeading(id)
  
      return {
        message: 'Heading delete',
        statusCode: HttpStatus.OK,
      };
    }
  
    async updateHeading(id, updateHeadingDto: UpdateHeadingDto) {
      try {
        const heading = await this.headingDao.getHeadingById(id)
  
  
        if (!heading) {
          throw new UnauthorizedException('Heading not fount')
        }
  
  
        await this.headingDao.updateHeading(id, updateHeadingDto)
  
        const newHeading = await this.headingDao.getHeadingById(id)
  
        return {
          message: 'Heading Update',
          statusCode: HttpStatus.OK,
          data: newHeading
        };
  
      } catch (error) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${error.code} ${error.detail} ${error.message}`,
          error: `Internal Error`,
        });
      }
    }
}
