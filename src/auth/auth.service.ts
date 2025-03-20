import { BadRequestException, HttpStatus, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { UserService } from 'src/user/user.service';
import { RefreshTokenService } from './refresh-token.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly userDao: UserDao,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
  ) { }


  async validateUser(email?: string, password?: string, name?: string) {
    if (!password) {
      throw new NotAcceptableException('Password not found');
    }

    let user

    if (email) {
      user = await this.userService.getUserByEmail(email);      
    }

    if (name) {
      user = await this.userService.getUserByName(name);      
    }

    if (!user) {
      throw new NotAcceptableException('Email, Name or Password are wrong.');
    }

    const passwordValid: boolean = await bcrypt.compare(
      password,
      user.usr_password,
    );

    if (!passwordValid) {
      throw new NotAcceptableException('Email, Name or Password are wrong.');
    }


    return user;
  }

  async login(loginDto: LoginDto) {
    try {
      let user = await this.validateUser(
        loginDto.usr_email,
        loginDto.usr_password,
        loginDto.usr_name
      );

      const { usr_id, usr_email, usr_role } = user

      const validateAccount = await this.userDao.isConfirmUser(user.usr_id);

      if (!validateAccount) {
        throw new UnauthorizedException(
          'Your account is not valid, you must validate your account with the code.',
        );
      }

      const payload = { userId: usr_id, email: usr_email, rol: usr_role };
      const tokens = await this.getTokens(payload)
      const response = await this.refreshTokenService.createRefreshToken((await tokens).refreshToken, usr_id);

      if (!response) {
        const refresh = await this.refreshTokenService.findRefreshTokenbyUser(usr_id)
        await this.refreshTokenService.deleteRefreshToken(refresh.rft_token)
        await this.refreshTokenService.createRefreshToken((await tokens).refreshToken, usr_id);
      }


      return {
        access_token: (await tokens).accessToken,
        refreshToken: (await tokens).refreshToken,
        expires_in: 180,
        token_type: "Bearer",
        usr_id: user.usr_id,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [`${error.message}`],
        error: 'Internal Error',
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

  async logout(req) {

    const { userId } = req.user
    
    const refresh = await this.refreshTokenService.findRefreshTokenbyUser(userId)

    if (!refresh) {
      throw new UnauthorizedException('Token no valido')
    }

    await this.refreshTokenService.deleteRefreshToken(refresh.rft_token)

    return {
      message: 'User logout',
      statusCode: HttpStatus.OK,
    };

  }

}
