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
      const name = await this.userDao.getUserByName(usr_name)

      if (name) {
        return {
          message: 'El nombre de usuario ya se encuentra en uso.',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      const update = {
        usr_name
      }
      await this.userDao.updateUser(usr_id, update)
    }

    const updateRole = {
      usr_role: "serviceSearch"
    }
    await this.userDao.updateUser(usr_id, updateRole)

    return {
      message: 'Cliente',
      statusCode: HttpStatus.OK,
      data: servicesSearch,
    };
  }

  async updateProfilePicture(sea_id: number, file: Express.Multer.File) {

    try {
      const servicesSearch = await this.servicesSearchDao.getServicesSearchById(sea_id);

      if (!servicesSearch) {
        return {
          message: 'Cliente no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      const imageUrl = await this.firebaseService.uploadFile(file, sea_id);

      const updateImg = {
        sea_profilePicture: imageUrl
      }

      await this.servicesSearchDao.updateServicesSearch(sea_id, updateImg)

      const newProfessional = await this.servicesSearchDao.getServicesSearchById(sea_id)

      return {
        message: 'Imagen del cliente actualizada con éxito',
        statusCode: HttpStatus.OK,
        data: newProfessional
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getServicesSearchById(id: number) {
    try {
      const servicesSearch = await this.servicesSearchDao.getServicesSearchById(id);

      if (!servicesSearch) {
        return {
          message: 'Cliente no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Cliente',
        statusCode: HttpStatus.OK,
        data: servicesSearch,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllServicesSearch() {
    try {
      const servicesSearch = await this.servicesSearchDao.getAllServicesSearch();

      if (servicesSearch.length === 0) {
        return {
          message: 'Clientes no encontrados',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }


      return {
        message: 'Cliente',
        statusCode: HttpStatus.OK,
        data: servicesSearch,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async deleteServicesSearch(id) {
    try {
      const servicesSearch = await this.servicesSearchDao.getServicesSearchById(id)

      if (!servicesSearch) {
        return {
          message: 'Cliente no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.servicesSearchDao.deleteServicesSearch(id)

      return {
        message: 'Cliente eliminado',
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

  async updateServicesSearch(id, updateServicesSearchDto: UpdateServicesSearchDto) {
    try {
      const servicesSearch = await this.servicesSearchDao.getServicesSearchById(id)

      if (!servicesSearch) {
        return {
          message: 'Cliente no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.servicesSearchDao.updateServicesSearch(id, updateServicesSearchDto)

      const newServicesSearch = await this.servicesSearchDao.getServicesSearchById(id)

      return {
        message: 'Cliente actualizado',
        statusCode: HttpStatus.OK,
        data: newServicesSearch
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
