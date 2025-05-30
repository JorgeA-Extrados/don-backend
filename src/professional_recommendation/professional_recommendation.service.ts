import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfessionalRecommendationDto } from './dto/create-professional_recommendation.dto';
import { UpdateProfessionalRecommendationDto } from './dto/update-professional_recommendation.dto';
import { ProfessionalRecommendationDao } from 'src/infrastructure/database/dao/professionalRecommendation.dao';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';

@Injectable()
export class ProfessionalRecommendationService {

  constructor(
    private readonly professionalRecommendationDao: ProfessionalRecommendationDao,
    private readonly userDao: UserDao,
  ) { }

  async toggleRecommendation(req, toUserId: number) {
    try {
      const { userId } = req.user
      if (userId === toUserId) {
        throw new Error('No puedes recomendarte a ti mismo');
      }

      const to = await this.userDao.getUserById(toUserId)

      if (!to) {
        return {
          message: 'Destinatario no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      const recomendacion = await this.professionalRecommendationDao.toggle(userId, toUserId);

      if (recomendacion.recommended === true) {
        return {
          message: 'Usuario recomendado',
          statusCode: HttpStatus.OK,
        };
      }

      if (recomendacion.recommended === false) {
        return {
          message: 'Recomendación eliminada',
          statusCode: HttpStatus.OK,
        };
      }

    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getRecommendationCount(userId: number) {
    try {
      const count = await this.professionalRecommendationDao.countRecommendations(userId);
      return {
        message: 'Recomendaciones',
        statusCode: HttpStatus.OK,
        data: {
          count
        }
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
