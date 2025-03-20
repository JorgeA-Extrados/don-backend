import { BadRequestException, ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { RefreshTokenService } from 'src/auth/refresh-token.service';
import { ConfirmUserDto } from 'src/auth/dto/confirm-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userDao: UserDao,
    private readonly refreshTokenService: RefreshTokenService,
  ) { }

  async createUser(createUserDto: CreateUserDto) {

    const { usr_email, usr_password, usr_name } = createUserDto

    const user = await this.userDao.getUserByEmail(usr_email)

    if (user) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'User Email already exists',
        user: true
      });
    }

    const userName = await this.userDao.getUserByName(usr_name)

    if (userName) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'User Name already exists',
        user: true
      });
    }

    const numericalCode = Math.floor(100000 + Math.random() * 900000);

    const createUser = {
      usr_email,
      usr_password,
      usr_name,
      usr_verification_code: numericalCode,
    }


    const newUser = await this.userDao.createUser(createUser);

    return {
      message: 'User',
      statusCode: HttpStatus.OK,
      data: {
        usr_id: newUser.usr_id,
        usr_verification_code: newUser.usr_verification_code
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

  async getUserByName(name: string) {
    try {
      return await this.userDao.getUserByName(name);

    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async deleteUser(req) {
    const { userId } = req.user

    const user = await this.userDao.getUserById(userId)

    if (!user) {
      throw new UnauthorizedException('User not fount')
    }

    const refresh = await this.refreshTokenService.findRefreshTokenbyUser(userId)

    if (refresh) {
      await this.refreshTokenService.deleteRefreshToken(refresh.rft_token)
    }

    await this.userDao.deleteUser(userId)

    return {
      message: 'User delete',
      statusCode: HttpStatus.OK,
    };
  }

  async updateUser(id, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userDao.getUserById(id)


      if (!user) {
        throw new UnauthorizedException('User not fount')
      }


      await this.userDao.updateUser(id, updateUserDto)

      const newUser = await this.userDao.getUserById(id)

      return {
        message: 'User Update',
        statusCode: HttpStatus.OK,
        data: {
          User: newUser
        }
      };

    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async confirmUser(confirmUserDto: ConfirmUserDto) {
    try {
      const { code, id } = confirmUserDto
      const user = await this.userDao.getUserById(id)

      if (!user) {
        throw new UnauthorizedException('User not fount')
      }

      if (code === user.usr_verification_code) {
        return await this.userDao.confirmUser(id)
      }
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }

  }
  
  async codeResend(id: number) {
    try {
      const user = await this.userDao.getUserById(id)

      if (!user) {
        throw new UnauthorizedException('User not fount')
      }


      return {
        message: 'User code',
        statusCode: HttpStatus.OK,
        data: {
          usr_verification_code: user.usr_verification_code
        },
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

