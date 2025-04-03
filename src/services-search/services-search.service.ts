import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateServicesSearchDto } from './dto/create-services-search.dto';
import { UpdateServicesSearchDto } from './dto/update-services-search.dto';
import { ServicesSearchDao } from 'src/infrastructure/database/dao/services_search.dao';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { FirebaseService } from 'src/infrastructure/config/firebase.service';

@Injectable()
export class ServicesSearchService {

  constructor(
    private readonly servicesSearchDao: ServicesSearchDao,
    private readonly userDao: UserDao,
    private readonly firebaseService: FirebaseService,
  ) { }


  async createServicesSearch(createServicesSearchDto: CreateServicesSearchDto) {

    const servicesSearch = await this.servicesSearchDao.createServicesSearch(createServicesSearchDto);

    const { usr_name, usr_id } = createServicesSearchDto
    if (usr_name) {
      const update = {
        usr_name
      }
      await this.userDao.updateUser(usr_id, update)
    }

    return {
      message: 'ServicesSearch',
      statusCode: HttpStatus.OK,
      data: servicesSearch,
    };
  }

  async updateProfilePicture(sea_id: number, file: Express.Multer.File) {

    try {
      const servicesSearch = await this.servicesSearchDao.getServicesSearchById(sea_id);

      if (!servicesSearch) throw new Error('Profesional no encontrado');

      const imageUrl = await this.firebaseService.uploadFile(file, sea_id);

      const updateImg = {
        sea_profilePicture: imageUrl
      }


      await this.servicesSearchDao.updateServicesSearch(sea_id, updateImg)

      const newProfessional = await this.servicesSearchDao.getServicesSearchById(sea_id)

      return {
        message: 'Services Search Image Update',
        statusCode: HttpStatus.OK,
        data: newProfessional
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
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
