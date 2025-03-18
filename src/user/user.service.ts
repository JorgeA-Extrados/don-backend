import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';

@Injectable()
export class UserService {
  constructor(
    private readonly userDao: UserDao,
  ) { }

  async createUser(createUserDto: CreateUserDto) {

    const { usr_email, usr_password } = createUserDto

    const user = await this.userDao.getUserByEmail(usr_email)

    if (user) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'User already exists',
        user: true
      });
    }

    const createUser = {
      usr_email,
      usr_password,
    }


    const newUser = await this.userDao.createUser(createUser);

    return {
      message: 'User',
      statusCode: HttpStatus.OK,
      data: {
        usr_id: newUser.usr_id
      },
    };
  }

  async getUserById(id: number) {
    try {
      const user = await this.userDao.getUserById(id);

      return {
        message: 'User',
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async getAllUser() {
    try {
      const user = await this.userDao.getAllUser();

      return {
        message: 'Users',
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.userDao.getUserByEmail(email);

    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

}

