import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserHeadingDto } from './dto/create-user-heading.dto';
import { UpdateUserHeadingDto } from './dto/update-user-heading.dto';
import { UserHeadingDao } from 'src/infrastructure/database/dao/userHeading.dao';
import { SubHeadingDao } from 'src/infrastructure/database/dao/subHeading.dao';

@Injectable()
export class UserHeadingService {

  constructor(
    private readonly userHeadingDao: UserHeadingDao,
    private readonly subHeadingDao: SubHeadingDao,
  ) { }


  async createUserHeading(createUserHeadingDto: CreateUserHeadingDto) {

    try {
      const { sbh_id, hea_id } = createUserHeadingDto
  
      if (sbh_id) {
        const subHeading = await this.subHeadingDao.getSubHeadingById(sbh_id)
  
        if (subHeading?.heading.hea_id !== hea_id) {
          throw new UnauthorizedException('El sub-rubro no pertenece al rubro seleccionado')
        }
  
      }
  
  
      const userHeading = await this.userHeadingDao.createUserHeading(createUserHeadingDto);
  
      return {
        message: 'User Heading',
        statusCode: HttpStatus.OK,
        data: userHeading,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async getUserHeadingById(id: number) {
    try {
      const userHeading = await this.userHeadingDao.getUserHeadingById(id);

      if (!userHeading) {
        throw new UnauthorizedException('Usuario-rubro no encontrado')
      }

      return {
        message: 'User Heading',
        statusCode: HttpStatus.OK,
        data: userHeading,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async getUserHeadingByUserId(id: number) {
    try {
      const userHeading = await this.userHeadingDao.getUserHeadingByUserId(id);

      if (userHeading.length === 0) {
        throw new UnauthorizedException('Usuario-rubro no encontrado')
      }

      return {
        message: 'User Heading',
        statusCode: HttpStatus.OK,
        data: userHeading,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async getAllUserHeading() {
    try {
      const userHeading = await this.userHeadingDao.getAllUserHeading();

      if (userHeading.length === 0) {
        throw new UnauthorizedException('Usuario-rubro no encontrado')
      }

      return {
        message: 'User Heading',
        statusCode: HttpStatus.OK,
        data: userHeading,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async deleteUserHeading(id) {
    const userHeading = await this.userHeadingDao.getUserHeadingById(id)

    if (!userHeading) {
      throw new UnauthorizedException('User Heading not fount')
    }

    await this.userHeadingDao.deleteUserHeading(id)

    return {
      message: 'User Heading delete',
      statusCode: HttpStatus.OK,
    };
  }

  async updateUserHeading(id, updateUserHeadingDto: UpdateUserHeadingDto) {
    try {
      const userHeading = await this.userHeadingDao.getUserHeadingById(id)


      if (!userHeading) {
        throw new UnauthorizedException('User Heading not fount')
      }


      await this.userHeadingDao.updateUserHeading(id, updateUserHeadingDto)

      const newUserHeading = await this.userHeadingDao.getUserHeadingById(id)

      return {
        message: 'User Heading Update',
        statusCode: HttpStatus.OK,
        data: newUserHeading
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
