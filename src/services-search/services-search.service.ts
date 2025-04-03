import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateServicesSearchDto } from './dto/create-services-search.dto';
import { UpdateServicesSearchDto } from './dto/update-services-search.dto';
import { ServicesSearchDao } from 'src/infrastructure/database/dao/services_search.dao';

@Injectable()
export class ServicesSearchService {

    constructor(
      private readonly servicesSearchDao: ServicesSearchDao,
    ) { }


    async createServicesSearch(createServicesSearchDto: CreateServicesSearchDto) {
  
      const servicesSearch = await this.servicesSearchDao.createServicesSearch(createServicesSearchDto);
  
      return {
        message: 'ServicesSearch',
        statusCode: HttpStatus.OK,
        data: servicesSearch,
      };
    }
  
    async getServicesSearchById(id: number) {
      try {
        const servicesSearch = await this.servicesSearchDao.getServicesSearchById(id);
  
        return {
          message: 'ServicesSearch',
          statusCode: HttpStatus.OK,
          data: servicesSearch,
        };
      } catch (error) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${error.code} ${error.detail} ${error.message}`,
          error: `Internal Error`,
        });
      }
    }
  
    async getAllServicesSearch() {
      try {
        const servicesSearch = await this.servicesSearchDao.getAllServicesSearch();
  
        return {
          message: 'ServicesSearch',
          statusCode: HttpStatus.OK,
          data: servicesSearch,
        };
      } catch (error) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `${error.code} ${error.detail} ${error.message}`,
          error: `Internal Error`,
        });
      }
    }
  
    async deleteServicesSearch(id) {
      const servicesSearch = await this.servicesSearchDao.getServicesSearchById(id)
  
      if (!servicesSearch) {
        throw new UnauthorizedException('ServicesSearch not fount')
      }
  
      await this.servicesSearchDao.deleteServicesSearch(id)
  
      return {
        message: 'ServicesSearch delete',
        statusCode: HttpStatus.OK,
      };
    }
  
    async updateServicesSearch(id, updateServicesSearchDto: UpdateServicesSearchDto) {
      try {
        const servicesSearch = await this.servicesSearchDao.getServicesSearchById(id)
  
  
        if (!servicesSearch) {
          throw new UnauthorizedException('ServicesSearch not fount')
        }
  
  
        await this.servicesSearchDao.updateServicesSearch(id, updateServicesSearchDto)
  
        const newServicesSearch = await this.servicesSearchDao.getServicesSearchById(id)
  
        return {
          message: 'ServicesSearch Update',
          statusCode: HttpStatus.OK,
          data: newServicesSearch
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
