import { BadRequestException, ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { RefreshTokenService } from 'src/auth/refresh-token.service';
import { ConfirmUserDto } from 'src/auth/dto/confirm-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly userDao: UserDao,
    private readonly refreshTokenService: RefreshTokenService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async createUser(createUserDto: CreateUserDto) {

    const { usr_email, usr_password, usr_phone, usr_passwordConfir, usr_over, usr_terms } = createUserDto


    const user = await this.userDao.getUserByEmail(usr_email)

    if (user) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'User Email already exists',
      });
    }

    if (usr_password != usr_passwordConfir) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Passwords must match',
      });
    }

    const numericalCode = Math.floor(100000 + Math.random() * 900000);

    const createUser = {
      usr_email,
      usr_password,
      usr_phone,
      usr_verification_code: numericalCode,
      usr_over,
      usr_terms
    }


    const newUser = await this.userDao.createUser(createUser);

    return {
      message: 'User',
      statusCode: HttpStatus.OK,
      data: {
        usr_id: newUser.usr_id,
        usr_verification_code: newUser.usr_verification_code,
        usr_phone: newUser.usr_phone
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
        const payload = { userId: user.usr_id, email: user.usr_email, rol: user.usr_role };
        const tokens = await this.getTokens(payload)
        const response = await this.refreshTokenService.createRefreshToken((await tokens).refreshToken, user.usr_id);

        if (!response) {
          const refresh = await this.refreshTokenService.findRefreshTokenbyUser(user.usr_id)
          await this.refreshTokenService.deleteRefreshToken(refresh.rft_token)
          await this.refreshTokenService.createRefreshToken((await tokens).refreshToken, user.usr_id);
        }

        await this.userDao.confirmUser(id)

        return {
          message: 'User confirm successfully',
          access_token: (await tokens).accessToken,
          refreshToken: (await tokens).refreshToken,
          expires_in: 180,
          token_type: "Bearer",
          usr_id: user.usr_id,
        };
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

      if (user.usr_verified === true) {
        throw new UnauthorizedException('User already verified')
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

  async getTokens(payloady: {}, payment?) {
    // Configuración base para el token de acceso
    const accessToken = await this.jwtService.signAsync(payloady, {
      secret: this.configService.get('jwt.jwt_secret'),
      expiresIn: '3m',
    });

    // Determinación del tiempo de expiración para el refresh token
    let refreshExpiresIn = '7d'; // Valor predeterminado


    // Generación del token de refresco
    const refreshToken = await this.jwtService.signAsync(payloady, {
      secret: this.configService.get('jwt.jwt_refresh_secret'),
      expiresIn: refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

}

