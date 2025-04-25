import { BadRequestException, ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { RefreshTokenService } from 'src/auth/refresh-token.service';
import { ConfirmUserDto } from 'src/auth/dto/confirm-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailRepository } from 'src/infrastructure/utils/email/email.repository';
import { CreditsDonDao } from 'src/infrastructure/database/dao/credits_don.dao';
import { UserVerificationAttemptsDao } from 'src/infrastructure/database/dao/user_verification_attempts.dao';

@Injectable()
export class UserService {

  constructor(
    private readonly userDao: UserDao,
    private readonly refreshTokenService: RefreshTokenService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly emailRepository: EmailRepository,
    private readonly creditsDonDao: CreditsDonDao,
    private readonly userVerificationAttemptsDao: UserVerificationAttemptsDao,
  ) {
    // this.client = Twilio(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN,
    // );
  }

  async createUser(createUserDto: CreateUserDto) {

    const { usr_email, usr_password, usr_phone, usr_passwordConfir, usr_over, usr_terms, usr_user_code } = createUserDto


    const user = await this.userDao.getUserByEmail(usr_email)

    if (user) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'El correo electrónico del usuario ya existe',
      });
    }

    if (usr_password != usr_passwordConfir) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Las contraseñas deben coincidir',
      });
    }

    if (usr_password) {
      // Validación de contraseña segura
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(usr_password)) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message:
            'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial',
        });
      }
    }

    if (usr_user_code) {
      const userCredits = await this.userDao.getUserByInvitationCode(usr_user_code)
      if (userCredits) {
        const credits = {
          cre_amount: 1,
          cre_isCredits: false,
          usr_id: userCredits.usr_id,
          crs_id: 1
        }
        const newCredits = await this.creditsDonDao.createCreditsDON(credits)
      }
    }

    const numericalCode = Math.floor(100000 + Math.random() * 900000);
    const uniqueCode = await this.generateUniqueInvitationCode();

    const createUser = {
      usr_email,
      usr_password,
      usr_phone,
      usr_verification_code: numericalCode,
      usr_over,
      usr_terms,
      usr_invitationCode: uniqueCode
    }


    const newUser = await this.userDao.createUser(createUser);


    // Registrar el intento de verificación
    await this.userVerificationAttemptsDao.createForgotPasswordAttempts(newUser.usr_id);

    // try {
    //   await this.sendMessage(newUser.usr_verification_code, newUser.usr_phone)
    // } catch (error) {
    //   throw new UnauthorizedException('Error al enviar el código de verificación.')
    // }

    try {
      await this.emailRepository.sendVerificationEmail(newUser.usr_email, newUser.usr_verification_code);
    } catch (error) {
      throw new UnauthorizedException('Error al enviar el código de verificación.')
    }

    return {
      message: 'Usuario',
      statusCode: HttpStatus.OK,
      data: {
        usr_id: newUser.usr_id
      },
    };
  }

  async getUserById(id: number) {
    try {
      const user = await this.userDao.getUserById(id);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado.')
      }

      return {
        message: 'Usuario',
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {

      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllUser() {
    try {
      const user = await this.userDao.getAllUser();

      if (user.length === 0) {
        throw new UnauthorizedException('Usuarios no encontrado.')
      }

      return {
        message: 'Usuario',
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {

      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userDao.getUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado.')
      }

      return user

    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getUserByName(name: string) {
    try {
      const user = await this.userDao.getUserByName(name);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado.')
      }

      return user

    } catch (error) {

      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }


      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async deleteUser(req) {
    try {
      const { userId } = req.user

      const user = await this.userDao.getUserById(userId)

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado.')
      }

      const refresh = await this.refreshTokenService.findRefreshTokenbyUser(userId)

      if (refresh) {
        await this.refreshTokenService.deleteRefreshToken(refresh.rft_token)
      }

      await this.userDao.deleteUser(userId)

      return {
        message: 'Usuario eliminado',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async updateUser(id, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userDao.getUserById(id)


      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado.')
      }


      await this.userDao.updateUser(id, updateUserDto)

      const newUser = await this.userDao.getUserById(id)

      return {
        message: 'Usuario eliminado',
        statusCode: HttpStatus.OK,
        data: {
          User: newUser
        }
      };

    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async confirmUser(confirmUserDto: ConfirmUserDto) {
    try {
      const { code, id } = confirmUserDto
      const user = await this.userDao.getUserById(id)

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado.')
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


        // Registrar el intento de verificación
        await this.userVerificationAttemptsDao.completeVerificationAttempt(user.usr_id);


        return {
          message: 'El usuario confirmado con éxito.',
          access_token: (await tokens).accessToken,
          refreshToken: (await tokens).refreshToken,
          expires_in: 180,
          token_type: "Bearer",
          usr_id: user.usr_id,
        };
      }
    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }

  }

  async codeResend(id: number) {
    try {
      const user = await this.userDao.getUserById(id)

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado.')
      }

      if (user.usr_verified === true) {
        throw new UnauthorizedException('Usuario ya verificado.')
      }

      // Verificar cuántos intentos de verificación tiene el usuario
      const attempts = await this.userVerificationAttemptsDao.getActiveAttempts(user.usr_id);

      if (attempts >= 2) {
        throw new UnauthorizedException('Ya has alcanzado el máximo número de intentos de verificación.');
      }


      // Registrar el intento de verificación
      await this.userVerificationAttemptsDao.createForgotPasswordAttempts(user.usr_id);

      try {
        await this.emailRepository.sendVerificationEmail(user.usr_email, user.usr_verification_code);
      } catch (error) {
        throw new UnauthorizedException('Error al enviar el código de verificación.')
      }

      return {
        message: 'Código enviado correctamente',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {

      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
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

  async generateUniqueInvitationCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 6;

    let code: string = '';
    let exists = true;

    while (exists) {
      code = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }

      // Verificamos si el código ya existe
      const existingUser = await this.userDao.getUserByInvitationCode(code);
      if (!existingUser) {
        exists = false;
      }
    }

    return code;
  }

}

