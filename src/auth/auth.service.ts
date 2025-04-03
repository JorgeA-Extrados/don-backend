import { BadRequestException, HttpStatus, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { UserService } from 'src/user/user.service';
import { RefreshTokenService } from './refresh-token.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { SendingCodeDto } from './dto/sendingCode.dto';
import { ForgotPasswordDao } from 'src/infrastructure/database/dao/forgot_password.dao';
import { CodeActivationDto } from './dto/code-activation.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { getHashedPassword } from 'src/user/user.utils';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly userDao: UserDao,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly forgotPasswordDao: ForgotPasswordDao,
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

      if (loginDto.isSocialAuth === true) {
        if (loginDto.usr_email) {
          const authUser = await this.userService.getUserByEmail(loginDto.usr_email); 
          const passwordValid: boolean = await bcrypt.compare(
            loginDto.usr_password,
            authUser?.usr_password,
          );
          if (!passwordValid) {
            throw new NotAcceptableException('You already have an account created with that email.');
          }
          // if (authUser) {
          //   throw new NotAcceptableException('You already have an account created with that email.');
          // }    
        }
      }

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

  async sendingCode(sendingCodeDto: SendingCodeDto) {

    let user = await this.userDao.getUserByEmail(sendingCodeDto.email)

    if (!user) {
      throw new NotAcceptableException('The email entered is incorrect.');
    }

    try {
      const numericalCode = Math.floor(100000 + Math.random() * 900000);

      var currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 3);

      const createForgotPassword = {
        numericalCode,
        currentDate,
        userId: user.usr_id
      }

      const emailVeri = await this.forgotPasswordDao.createForgotPassword(createForgotPassword)

      return {
        message: 'Code to change password',
        statusCode: HttpStatus.OK,
        data: {
          code: emailVeri.fop_code,
          usr_phone: user.usr_phone
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

  async codeActivation(userId: number, codeActivationDto: CodeActivationDto) {
    var newDate = new Date();
    var currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 3);
    const getforgotPassword = {
      userId,
      code: codeActivationDto.code,
      newDate,
      currentDate
    }
    const code = await this.forgotPasswordDao.getForgotPasswordByUserIdAndCode(getforgotPassword)

    if (!code) {
      return {
        message: 'incorrect code or its usage time expired',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    //Una ves que verificamos que es codigo es el correcto actualizamos el mismo cambiando es is_active a true, poniendo la fecha de uso para una hora mas que la que tiene
    var passwordTimeChange = new Date();
    passwordTimeChange.setHours(passwordTimeChange.getHours() + 1);
    const update = {
      fop_change_time: passwordTimeChange,
      fop_is_active: true
    }
    await this.forgotPasswordDao.updateForgotPassword(code.fop_id, update)

    //Buscamos los otros codigos que tengan el mismo usuario y ponemos el is_active en false
    const userCodes = await this.forgotPasswordDao.getForgotPasswordByUserId(userId)

    userCodes.forEach(async (userCode) => {
      await this.forgotPasswordDao.updateForgotPassword(userCode.fop_id, { fop_is_active: false })
    })

    //Retornamos el mensaje de que el codigo utilizado es correcto
    return {
      message: 'Code validated correctly',
      statusCode: HttpStatus.OK
    }
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    var newDate = new Date();
    var currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);

    const changetime = { userId, newDate, currentDate }
    const code = await this.forgotPasswordDao.getForgotPasswordByUserIdAndChangeTime(changetime)

    if (!code) {
      return {
        message: 'You must validate your code to make the change. The code can be used only once.',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    const { newPassword, newPasswordRepeat } = changePasswordDto

    const user = await this.userDao.getUserById(userId)

    if (!user) {
      throw new NotAcceptableException('User not found.');
    }

    if (newPassword != newPasswordRepeat) {
      throw new NotAcceptableException('Your passwords must match.');
    }

    const hashedPassword = await getHashedPassword(newPassword);

    const updatePassword = { userId, hashedPassword, fopId: code.fop_id }

    return await this.userDao.updateUserPassword(updatePassword)
  }

}
