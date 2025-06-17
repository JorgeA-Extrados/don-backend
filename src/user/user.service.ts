import { BadRequestException, ConflictException, forwardRef, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { ProfessionalDao } from 'src/infrastructure/database/dao/professional.dao';
import { ServicesSearchDao } from 'src/infrastructure/database/dao/services_search.dao';
import { SupplierDao } from 'src/infrastructure/database/dao/supplier.dao';
import { CreateAllUserDto } from './dto/all-user.dto';
import * as bcrypt from 'bcryptjs';
import { ExperienceDao } from 'src/infrastructure/database/dao/experiences.dao';
import { UserHeadingDao } from 'src/infrastructure/database/dao/userHeading.dao';
import { PublicationDao } from 'src/infrastructure/database/dao/publication.dao';
import { AuthService } from 'src/auth/auth.service';
import { CreateDeletePhysicsDto } from './dto/deletePhysics.dto';
import { PublicationMultimediaDao } from 'src/infrastructure/database/dao/publication_multimedia.dao';
import { ReportPublicationDao } from 'src/infrastructure/database/dao/reportPublication.dao';
import { ForgotPasswordAttemptsDao } from 'src/infrastructure/database/dao/forgot_password_attempts.dao';
import { ForgotPasswordDao } from 'src/infrastructure/database/dao/forgot_password.dao';
import { ProfessionalRecommendationDao } from 'src/infrastructure/database/dao/professionalRecommendation.dao';

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
    private readonly professionalDao: ProfessionalDao,
    private readonly servicesSearchDao: ServicesSearchDao,
    private readonly supplierDao: SupplierDao,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly experienceDao: ExperienceDao,
    private readonly userHeadingDao: UserHeadingDao,
    private readonly publicationDao: PublicationDao,
    private readonly publicationMultimediaDao: PublicationMultimediaDao,
    private readonly reportPublicationDao: ReportPublicationDao,
    private readonly forgotPasswordAttemptsDao: ForgotPasswordAttemptsDao,
    private readonly forgotPasswordDao: ForgotPasswordDao,
    private readonly professionalRecommendationDao: ProfessionalRecommendationDao,
  ) {
    // this.client = Twilio(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN,
    // );
  }

  async createUser(createUserDto: CreateUserDto) {

    const { usr_email, usr_password, usr_phone, usr_passwordConfir, usr_over, usr_terms, usr_user_code } = createUserDto

    const deletedUser = await this.userDao.getUserByEmailDelete(usr_email)

    if (deletedUser?.usr_delete) {
      // Renombrar el correo para que se pueda crear uno nuevo con el mismo
      deletedUser.usr_email_original = deletedUser.usr_email;
      deletedUser.usr_email = `${deletedUser.usr_email}_deleted_${Date.now()}`;

      await this.userDao.updateUser(deletedUser.usr_id, deletedUser);
    }

    const user = await this.userDao.getUserByEmail(usr_email)

    if (user) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'El correo electrónico del usuario ya existe',
      });
    }

    if (!createUserDto.isSocialAuth) {
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
    }


    if (usr_user_code) {
      const userCredits = await this.userDao.getUserByInvitationCode(usr_user_code)
      if (userCredits) {
        const credits = {
          cre_amount: 1,
          cre_isCredits: false,
          usr_id: userCredits.usr_id,
          crs_id: 1,
          cre_isAdmin: false
        }
        const newCredits = await this.creditsDonDao.createCreditsDON(credits)
      }
    }

    let newUser

    if (!createUserDto.isSocialAuth) {
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

      newUser = await this.userDao.createUser(createUser);

      // Registrar el intento de verificación
      await this.userVerificationAttemptsDao.createForgotPasswordAttempts(newUser.usr_id);

      try {
        await this.emailRepository.sendVerificationEmail(newUser.usr_email, newUser.usr_verification_code);
      } catch (error) {
        return {
          message: 'Error al enviar el código de verificación.',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
    } else {
      const uniqueCode = await this.generateUniqueInvitationCode();
      const dto = {
        usr_email,
        usr_password,
        isSocialAuth: createUserDto.isSocialAuth,
        isSignup: true,
        usr_phone,
        usr_over,
        usr_terms,
        usr_invitationCode: uniqueCode
      }
      newUser = await this.userDao.createUser(dto);

      const log = {
        usr_email,
        usr_password
      }

      const login = await this.authService.login(log)

      return {
        access_token: login.access_token,
        refreshToken: login.refreshToken,
        expires_in: 180,
        token_type: "Bearer",
        usr_id: login.usr_id,
      };
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
      const user = await this.userDao.getUserProfileById(id);

      if (!user) {
        return {
          message: 'Usuario no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      const { professional, servicesSearch, supplier } = user;

      const userHeading = (user.userHeading ?? []) as unknown as any[];

      const usr_heading = userHeading.map((item) => item.heading?.hea_name).filter(Boolean);

      const usr_profilePicture =
        professional?.pro_profilePicture ??
        supplier?.sup_profilePicture ??
        servicesSearch?.sea_profilePicture ??
        null;

      const usr_firstName =
        professional?.pro_firstName ??
        supplier?.sup_firstName ??
        servicesSearch?.sea_firstName ??
        null;

      const usr_lastName =
        professional?.pro_lastName ??
        supplier?.sup_lastName ??
        servicesSearch?.sea_lastName ??
        null;

      // const processAddress = (address: string | null): string | null => {
      //   if (!address) return null;

      //   const parts = address.split(',');
      //   return parts.length <= 1
      //     ? address.trim()
      //     : parts.slice(1).join(',').trim();
      // };

      // const usr_address = processAddress(
      //   professional?.pro_address ??
      //   supplier?.sup_address ??
      //   servicesSearch?.sea_address ??
      //   null
      // );

      const usr_address =
        professional?.pro_address ??
        supplier?.sup_address ??
        servicesSearch?.sea_address ??
        null;

      const usr_description =
        professional?.pro_description ??
        supplier?.sup_description ??
        servicesSearch?.sea_description ??
        null;

      const newUser = {
        usr_id: user.usr_id,
        usr_email: user.usr_email,
        usr_invitationCode: user.usr_invitationCode,
        usr_name: user.usr_name,
        usr_role: user.usr_role,
        usr_phone: user.usr_phone,
        usr_profilePicture,
        usr_firstName,
        usr_lastName,
        usr_address,
        usr_description,
        usr_heading
      };

      return {
        message: 'Usuario',
        statusCode: HttpStatus.OK,
        data: newUser,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getUserInvitationCode(req) {
    try {
      const { userId } = req.user
      const user = await this.userDao.getUserInvitationCode(userId);

      if (!user) {
        return {
          message: 'Usuario no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Codigo de Invitación',
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
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
        return {
          message: 'Usuarios no encontrados.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Usuario',
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
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
        return {
          message: 'Usuario no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return user



    } catch (error) {
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
        return {
          message: 'Usuario no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return user

    } catch (error) {
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
        return {
          message: 'Usuario no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      const refresh = await this.refreshTokenService.findRefreshTokenbyUser(userId)

      if (refresh) {
        await this.refreshTokenService.deleteRefreshToken(refresh.rft_token)
      }

      const profesionalRecommendation = await this.professionalRecommendationDao.getProfessionalRecommendationByUsrID(user.usr_id)

      if (profesionalRecommendation.length > 0) {
        profesionalRecommendation.map(async (profesionalRecomment) => {
          await this.professionalRecommendationDao.delete(profesionalRecomment.prr_id)
        })
      }

      const servicesSearch = await this.servicesSearchDao.getServicesSearchByUsrId(userId)

      if (servicesSearch) {
        await this.servicesSearchDao.deleteServicesSearch(servicesSearch.sea_id)
      }

      const supplier = await this.supplierDao.getSupplierByUserId(userId)

      if (supplier) {
        await this.supplierDao.deleteSupplier(supplier.sup_id)
      }

      const professional = await this.professionalDao.getProfessionalByUsrId(userId)

      if (professional) {
        await this.professionalDao.deleteProfessional(professional.pro_id)
      }

      const experience = await this.experienceDao.getAllExperienceByUserID(userId)

      if (experience.length > 0) {
        experience.map(async (expt) => {
          await this.experienceDao.deleteExperience(expt.exp_id)
        })
      }

      const userHeading = await this.userHeadingDao.getUserHeadingByUserId(userId)

      if (userHeading.length > 0) {
        userHeading.map(async (userHea) => {
          await this.userHeadingDao.deleteUserHeading(userHea.ush_id)
        })
      }


      const publication = await this.publicationDao.getPublicationByUserId(user.usr_id)

      if (publication.length > 0) {
        publication.map(async (pub) => {
          const publicImage = await this.publicationMultimediaDao.getPUblicationImageByPubID(pub.pub_id)

          const report = await this.reportPublicationDao.getReportPublicationByPUBID(pub.pub_id)

          report.map(async (reportes) => {
            await this.reportPublicationDao.deleteReportPublication(reportes.rep_id)
          })

          publicImage.map(async (images) => {
            await this.publicationMultimediaDao.deletePublicationMultimedia(images.pmt_id)
          })

          await this.publicationDao.deletePublication(pub.pub_id)
        })
      }

      const creditsDon = await this.creditsDonDao.getCreditsDonByUsrIdDelete(userId)

      if (creditsDon.length > 0) {
        creditsDon.map(async (cred) => {
          await this.creditsDonDao.deleteCreditsDon(cred.cre_id)
        })
      }

      await this.userDao.deleteUser(userId)

      return {
        message: 'Usuario eliminado',
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

  async deleteUserPhysics(createDeletePhysicsDto: CreateDeletePhysicsDto) {
    try {
      const { usr_email, usr_password } = createDeletePhysicsDto;

      const user = await this.validateUser(usr_email, usr_password);

      if (!user) {
        return {
          message: 'Usuario no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      const promises: Promise<void>[] = [];

      // Operaciones en paralelo
      const refresh = await this.refreshTokenService.findRefreshTokenbyUser(user.usr_id);
      if (refresh) {
        promises.push(this.refreshTokenService.deleteRefreshToken(refresh.rft_token));
      }

      const forgotPasswordAttempts = await this.forgotPasswordAttemptsDao.getForgotPasswordAttemptsByUser(user.usr_id);
      promises.push(...forgotPasswordAttempts.map(f =>
        this.forgotPasswordAttemptsDao.deleteForgotPasswordAttemptsFisicaById(f.fpa_id)));

      const forgotPassword = await this.forgotPasswordDao.getForgotPasswordDeleteByUserId(user.usr_id);
      promises.push(...forgotPassword.map(f =>
        this.forgotPasswordDao.deleteForgotPasswordFisicaById(f.fop_id)));

      const userVerification = await this.userVerificationAttemptsDao.getUserVerification(user.usr_id);
      promises.push(...userVerification.map(u =>
        this.userVerificationAttemptsDao.deleteForgotPasswordAttemptsFisicaById(u.uva_id)));

      const profesionalRecommendation = await this.professionalRecommendationDao.getProfessionalRecommendationDeleteByUsrID(user.usr_id);
      promises.push(...profesionalRecommendation.map(p =>
        this.professionalRecommendationDao.deleteReportRecommendationsFisicaById(p.prr_id)));

      const servicesSearch = await this.servicesSearchDao.getServicesSearchDeleteByUsrId(user.usr_id);
      if (servicesSearch) {
        promises.push(this.servicesSearchDao.deleteServicesSearchPhysics(servicesSearch.sea_id));
      }

      const supplier = await this.supplierDao.getSupplierDeleteByUserId(user.usr_id);
      if (supplier) {
        promises.push(this.supplierDao.deleteSupplierPhysicsById(supplier.sup_id));
      }

      const professional = await this.professionalDao.getProfessionalDeleteByUsrId(user.usr_id);
      if (professional) {
        promises.push(this.professionalDao.deleteProfessionalPhysicsById(professional.pro_id));
      }

      const experience = await this.experienceDao.getAllExperienceDeleteByUserID(user.usr_id);
      promises.push(...experience.map(e =>
        this.experienceDao.deleteExperiencePhysicsById(e.exp_id)));

      const userHeading = await this.userHeadingDao.getUserHeadingDeleteByUserId(user.usr_id);
      promises.push(...userHeading.map(u =>
        this.userHeadingDao.deleteUserHeadingPhysicsById(u.ush_id)));

      const report = await this.reportPublicationDao.getReportPublicationByUsrID(user.usr_id);
      promises.push(...report.map(r =>
        this.reportPublicationDao.deleteReportPublicationFisicaById(r.rep_id)));

      const creditsDon = await this.creditsDonDao.getCreditsDonDeleteByUsrIdDelete(user.usr_id);
      promises.push(...creditsDon.map(c =>
        this.creditsDonDao.deleteCreditsDonPhysics(c.cre_id)));

      // Esperar todo lo anterior
      await Promise.all(promises);

      // Secuencial: eliminar imágenes de publicaciones y luego publicaciones
      const publications = await this.publicationDao.getPublicationDeleteByUserId(user.usr_id);

      for (const pub of publications) {
        const images = await this.publicationMultimediaDao.getPUblicationImageByPubID(pub.pub_id);

        for (const img of images) {
          await this.publicationMultimediaDao.deletePublicationMultimediaPhysicsById(img.pmt_id);
        }

        await this.publicationDao.deletePublicationPhysics(pub.pub_id);
      }

      // Finalmente eliminamos el usuario
      await this.userDao.userRemove(user.usr_id);

      return {
        message: 'Usuario eliminado',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Error al eliminar usuario físicamente:', error);
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code || ''} ${error.detail || ''} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async updateUser(req, createAllUserDto: CreateAllUserDto) {
    try {
      const { userId } = req.user

      const user = await this.userDao.getUserById(userId)

      if (!user) {
        return {
          message: 'Usuario no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }
      // Actualizamos el usuario base (campos que pertenezcan a la entidad User)
      const userFields = this.extractUserFields(createAllUserDto);
      await this.userDao.updateUser(userId, userFields);

      // Dependiendo del rol o subperfil relacionado, actualizamos el subperfil correspondiente
      if (user.professional) {
        const proFields = this.mapToProfessionalFields(createAllUserDto);
        await this.professionalDao.updateProfessional(user.professional.pro_id, proFields);
      } else if (user.servicesSearch) {
        const seaFields = this.mapToServicesSearchFields(createAllUserDto);
        await this.servicesSearchDao.updateServicesSearch(user.servicesSearch.sea_id, seaFields);
      } else if (user.supplier) {
        const supFields = this.mapToSupplierFields(createAllUserDto);
        await this.supplierDao.updateSupplier(user.supplier.sup_id, supFields);
      }

      const newUser = await this.userDao.getUserById(userId)

      return {
        message: 'Usuario actualizado',
        statusCode: HttpStatus.OK,
        data: {
          User: newUser
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

  async confirmUser(confirmUserDto: ConfirmUserDto) {
    try {
      const { code, id } = confirmUserDto
      const user = await this.userDao.getUserById(id)

      if (!user) {
        return {
          message: 'Usuario no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
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
        return {
          message: 'Usuario no encontrado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      if (user.usr_verified === true) {
        return {
          message: 'Usuario ya verificado.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      // Verificar cuántos intentos de verificación tiene el usuario
      const attempts = await this.userVerificationAttemptsDao.getActiveAttempts(user.usr_id);

      if (attempts >= 2) {
        return {
          message: 'Ya has alcanzado el máximo número de intentos de verificación.',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }


      // Registrar el intento de verificación
      await this.userVerificationAttemptsDao.createForgotPasswordAttempts(user.usr_id);

      try {
        if (user.usr_verification_code) {
          await this.emailRepository.sendVerificationEmail(user.usr_email, user.usr_verification_code);
        }
      } catch (error) {
        return {
          message: 'Error al enviar el código de verificación.',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      return {
        message: 'Código enviado correctamente',
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

  private extractUserFields(dto: any) {
    const fields: any = {};

    if (dto.usr_phone != null) fields.usr_phone = dto.usr_phone;
    fields.usr_update = new Date()

    return fields;
  }

  private mapToProfessionalFields(dto: any) {
    const fields: any = {};

    if (dto.usr_firstName != null) fields.pro_firstName = dto.usr_firstName;
    if (dto.usr_lastName != null) fields.pro_lastName = dto.usr_lastName;
    if (dto.usr_latitude != null) fields.pro_latitude = dto.usr_latitude;
    if (dto.usr_longitude != null) fields.pro_longitude = dto.usr_longitude;
    if (dto.usr_address != null) fields.pro_address = dto.usr_address;
    if (dto.usr_description != null) fields.pro_description = dto.usr_description;
    fields.pro_update = new Date()

    return fields;
  }

  private mapToServicesSearchFields(dto: any) {
    const fields: any = {};

    if (dto.usr_firstName != null) fields.sea_firstName = dto.usr_firstName;
    if (dto.usr_lastName != null) fields.sea_lastName = dto.usr_lastName;
    if (dto.usr_latitude != null) fields.sea_latitude = dto.usr_latitude;
    if (dto.usr_longitude != null) fields.sea_longitude = dto.usr_longitude;
    if (dto.usr_address != null) fields.sea_address = dto.usr_address;
    if (dto.usr_description != null) fields.sea_description = dto.usr_description;
    fields.sea_update = new Date()

    return fields;
  }

  private mapToSupplierFields(dto: any) {
    const fields: any = {};

    if (dto.usr_firstName != null) fields.sup_firstName = dto.usr_firstName;
    if (dto.usr_lastName != null) fields.sup_lastName = dto.usr_lastName;
    if (dto.usr_latitude != null) fields.sup_latitude = dto.usr_latitude;
    if (dto.usr_longitude != null) fields.sup_longitude = dto.usr_longitude;
    if (dto.usr_address != null) fields.sup_address = dto.usr_address;
    if (dto.usr_description != null) fields.sup_description = dto.usr_description;
    fields.sup_update = new Date()

    return fields;
  }

  async validateUser(email?: string, password?: string) {
    if (!password) {
      throw new UnauthorizedException('Contraseña no encontrada');
    }

    let user

    if (email) {
      user = await this.userDao.getUserByEmail(email);
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

}

