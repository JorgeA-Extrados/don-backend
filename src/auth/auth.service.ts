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
import { ForgotPasswordAttemptsDao } from 'src/infrastructure/database/dao/forgot_password_attempts.dao';
import { EmailRepository } from 'src/infrastructure/utils/email/email.repository';


@Injectable()
export class AuthService {

  constructor(
    private readonly userDao: UserDao,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly forgotPasswordDao: ForgotPasswordDao,
    private readonly forgotPasswordAttemptsDao: ForgotPasswordAttemptsDao,
    private readonly emailRepository: EmailRepository,
    private readonly userService: UserService,
  ) { }


  async validateUser(email?: string, password?: string, name?: string) {
    if (!password) {
      throw new UnauthorizedException('Contraseña no encontrada');
    }

    let user

    if (email) {
      user = await this.userDao.getUserByEmail(email);
    }

    if (name) {
      user = await this.userDao.getUserByName(name);
    }

    if (!user) {
      throw new UnauthorizedException('El correo electrónico, el nombre o la contraseña son incorrectos.');
    }

    const passwordValid: boolean = await bcrypt.compare(
      password,
      user.usr_password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('El correo electrónico, el nombre o la contraseña son incorrectos.');
    }


    return user;
  }

  async login(loginDto: LoginDto) {
    try {
      let isNewUser

      if (loginDto.isSocialAuth === true) {
        if (loginDto.usr_email) {
          const authUser = await this.userDao.getUserByEmail(loginDto.usr_email);

          if (!authUser) {
            const dto = {
              usr_email: loginDto.usr_email,
              usr_password: loginDto.usr_password,
              isSocialAuth: loginDto.isSocialAuth
            }
            const newUser = await this.userService.createUser(dto)
            if (newUser) {
              isNewUser = true
            }
          } else {
            const passwordValid: boolean = await bcrypt.compare(
              loginDto.usr_password,
              authUser?.usr_password,
            );
            if (!passwordValid) {
              throw new UnauthorizedException('Ya tienes una cuenta creada con ese correo electrónico.');
            }
          }

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
        // throw new UnauthorizedException(
        //   'Su cuenta fue validada, debe ingresar el código de verificación.',
        // );
        throw new UnauthorizedException({
          message: 'Su cuenta no fue validada, debe ingresar el código de verificación.',
          usrID: user.usr_id,
        });
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
        isNewUser
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [`${error.message}`],
        error: 'Error interno',
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
      message: 'Cierre de sesión de usuario',
      statusCode: HttpStatus.OK,
    };

  }

  async sendingCode(sendingCodeDto: SendingCodeDto) {

    let user = await this.userDao.getUserByEmail(sendingCodeDto.email)

    if (!user) {
      throw new NotAcceptableException('El correo electrónico ingresado es incorrecto');
    }

    const existingRequest = await this.forgotPasswordAttemptsDao.getActiveRequest(user.usr_id);

    if (!existingRequest) {
      // Si no hay intento activo, se crea uno nuevo
      await this.forgotPasswordAttemptsDao.createForgotPasswordAttempts(user.usr_id);
    } else {
      // Si ya hay un intento y ya envió 2 códigos, no se permite enviar más
      if (existingRequest.fpa_attempts >= 2) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Ya has solicitado el código el máximo de veces permitidas. Por favor, comuniquese al servicio técnico +5400000000000.`,
          error: 'Demasiados intentos',
        });
      }

      // Si está dentro del límite, se incrementan los intentos
      await this.forgotPasswordAttemptsDao.incrementAttempts(existingRequest.fpa_id);
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

      try {
        await this.emailRepository.sendChangePasswordEmail(user.usr_email, emailVeri.fop_code);
      } catch (error) {
        throw new UnauthorizedException('Error al enviar el código de verificación.')
      }

      return {
        message: 'Se envió el código para cambiar contraseña.',
        statusCode: HttpStatus.OK,
        data: {
          userId: user.usr_id
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
        message: 'Código incorrecto o su tiempo de uso expiró.',
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

    const request = await this.forgotPasswordAttemptsDao.getActiveRequest(userId);
    if (request) {
      await this.forgotPasswordAttemptsDao.completeRequest(request.fpa_id);
    }

    //Retornamos el mensaje de que el codigo utilizado es correcto
    return {
      message: 'Código validado correctamente.',
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
        message: 'Debes validar tu código para realizar el cambio. El código solo se puede usar una vez.',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    const request = await this.forgotPasswordAttemptsDao.getActiveRequest(userId);
    if (request?.fpa_completed === true) {
      return {
        message: 'Solicitud no validada. Debes completar la validación del código primero.',
        statusCode: HttpStatus.FORBIDDEN,
      };
    }

    const { newPassword, newPasswordRepeat } = changePasswordDto

    const user = await this.userDao.getUserById(userId)

    if (!user) {
      throw new NotAcceptableException('Usuario no encontrado.');
    }

    if (newPassword != newPasswordRepeat) {
      throw new NotAcceptableException('Sus contraseñas deben coincidir.');
    }

    const hashedPassword = await getHashedPassword(newPassword);

    const updatePassword = { userId, hashedPassword, fopId: code.fop_id }

    return await this.userDao.updateUserPassword(updatePassword)
  }

}
