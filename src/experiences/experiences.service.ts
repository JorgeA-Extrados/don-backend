import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperienceDao } from 'src/infrastructure/database/dao/experiences.dao';

@Injectable()
export class ExperiencesService {

  constructor(
    private readonly experienceDao: ExperienceDao,
  ) { }


  async createExperience(createExperienceDto: CreateExperienceDto) {

    const experience = await this.experienceDao.createExperience(createExperienceDto);

    return {
      message: 'Experiencia',
      statusCode: HttpStatus.OK,
      data: experience,
    };
  }

  async getExperienceById(id: number) {
    try {
      const experience = await this.experienceDao.getExperienceById(id);

      if (!experience) {
        return {
          message: 'Experiencia no encontrada.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Experiencia',
        statusCode: HttpStatus.OK,
        data: experience,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllExperience() {
    try {
      const experience = await this.experienceDao.getAllExperience();


      if (experience.length === 0) {
        return {
          message: 'Experiencia no encontrada.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Experiencias',
        statusCode: HttpStatus.OK,
        data: experience,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async deleteExperience(id) {
    try {
      const experience = await this.experienceDao.deleteExperience(id)

      if (!experience) {
        return {
          message: 'Experiencia no encontrada.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.experienceDao.deleteExperience(id)

      return {
        message: 'Experiencia eliminada',
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

  async updateExperience(id, updateExperienceDto: UpdateExperienceDto) {
    try {
      const experience = await this.experienceDao.getExperienceById(id)

      if (!experience) {
        return {
          message: 'Experiencia no encontrada.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.experienceDao.updateExperience(id, updateExperienceDto)

      const newExperience = await this.experienceDao.getExperienceById(id)

      return {
        message: 'Experiencia actualizada',
        statusCode: HttpStatus.OK,
        data: newExperience
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
