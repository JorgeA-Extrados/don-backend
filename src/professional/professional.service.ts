import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalDao } from 'src/infrastructure/database/dao/professional.dao';
import { FirebaseService } from 'src/infrastructure/config/firebase.service';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';

@Injectable()
export class ProfessionalService {
  constructor(
    private readonly professionalDao: ProfessionalDao,
    private readonly userDao: UserDao,
    private readonly firebaseService: FirebaseService,
  ) { }


  async createProfessional(createProfessionalDto: CreateProfessionalDto) {

    const professional = await this.professionalDao.createProfessional(createProfessionalDto);

    const { usr_name, usr_id } = createProfessionalDto
    if (usr_name) {
      const update = {
        usr_name
      }
      await this.userDao.updateUser(usr_id, update)
    }

    return {
      message: 'Profesional',
      statusCode: HttpStatus.OK,
      data: professional,
    };
  }

  async updateProfilePicture(pro_id: number, file: Express.Multer.File) {

    try {
      const professional = await this.professionalDao.getProfessionalById(pro_id);

      if (!professional) throw new Error('Profesional no encontrado');

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
        throw new UnauthorizedException('Profesional no encontrado')
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
        throw new UnauthorizedException('Profesional no encontrado')
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
    const professional = await this.professionalDao.getProfessionalById(id)

    if (!professional) {
      throw new UnauthorizedException('Profesional no encontrado')
    }

    await this.professionalDao.deleteProfessional(id)

    return {
      message: 'Profesional eliminado',
      statusCode: HttpStatus.OK,
    };
  }

  async updateProfessional(id, updateProfessionalDto: UpdateProfessionalDto) {
    try {
      const professional = await this.professionalDao.getProfessionalById(id)


      if (!professional) {
        throw new UnauthorizedException('Profesional no encontrado')
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
}
