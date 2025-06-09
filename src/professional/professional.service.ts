import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalDao } from 'src/infrastructure/database/dao/professional.dao';
import { FirebaseService } from 'src/infrastructure/config/firebase.service';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { SearchProfessionalDto } from './dto/search-professional.dto';

@Injectable()
export class ProfessionalService {

  constructor(
    private readonly professionalDao: ProfessionalDao,
    private readonly userDao: UserDao,
    private readonly firebaseService: FirebaseService,
  ) { }


  async createProfessional(createProfessionalDto: CreateProfessionalDto) {

    const { usr_name, usr_id, usr_phone } = createProfessionalDto
    if (usr_name || usr_phone) {
      if (usr_name) {
        const name = await this.userDao.getUserByName(usr_name)

        if (name) {
          return {
            message: 'El nombre de usuario ya se encuentra en uso.',
            statusCode: HttpStatus.NOT_FOUND,
          };
        }
      }

      const update = {
        usr_name,
        usr_phone
      }
      await this.userDao.updateUser(usr_id, update)
    }

    const professional = await this.professionalDao.createProfessional(createProfessionalDto);

    const updateRole = {
      usr_role: "professional"
    }
    await this.userDao.updateUser(usr_id, updateRole)

    return {
      message: 'Profesional',
      statusCode: HttpStatus.OK,
      data: professional,
    };
  }

  async updateProfilePicture(pro_id: number, file: Express.Multer.File) {

    try {
      const professional = await this.professionalDao.getProfessionalById(pro_id);

      if (!professional) {
        return {
          message: 'Profesional no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      const imageUrl = await this.firebaseService.uploadFile(file, pro_id);

      const updateImg = {
        pro_profilePicture: imageUrl
      }

      await this.professionalDao.updateProfessional(pro_id, updateImg)

      const newProfessional = await this.professionalDao.getProfessionalById(pro_id)

      return {
        message: 'Imagen del profesional actualizada con éxito',
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

  async getProfessionalById(id: number) {
    try {
      const professional = await this.professionalDao.getProfessionalById(id);

      if (!professional) {
        return {
          message: 'Profesional no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Profesional',
        statusCode: HttpStatus.OK,
        data: professional,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllProfessional() {
    try {
      const professional = await this.professionalDao.getAllProfessional();

      if (professional.length === 0) {
        return {
          message: 'Profesionales no encontrados.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Profesional',
        statusCode: HttpStatus.OK,
        data: professional,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async deleteProfessional(id) {
    try {
      const professional = await this.professionalDao.getProfessionalById(id)

      if (!professional) {
        return {
          message: 'Profesional no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.professionalDao.deleteProfessional(id)

      return {
        message: 'Profesional eliminado',
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

  async updateProfessional(id, updateProfessionalDto: UpdateProfessionalDto) {
    try {
      const professional = await this.professionalDao.getProfessionalById(id)

      if (!professional) {
        return {
          message: 'Profesional no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.professionalDao.updateProfessional(id, updateProfessionalDto)

      const newProfessional = await this.professionalDao.getProfessionalById(id)

      return {
        message: 'Profesional actualizado',
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

  async searchProfessionals(searchProfessionalDto: SearchProfessionalDto, req) {
    try {

      const { userId } = req.user

      const profesional = await this.professionalDao.getProfessionalByUsrId(userId)

      const searchProfessional = await this.professionalDao.searchProfessionals(searchProfessionalDto, profesional?.pro_id);

      if (searchProfessional.length === 0) {
        return {
          message: 'Profesional no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Profesionales',
        statusCode: HttpStatus.OK,
        data: searchProfessional,
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
