import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { ForgotPasswordAttempts } from "src/auth/entities/forgot_password_attempts.entity";



Injectable()
export class ForgotPasswordAttemptsDao {

    constructor(
        @InjectRepository(ForgotPasswordAttempts)
        private forgotPasswordAttemptsRepository: Repository<ForgotPasswordAttempts>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createForgotPasswordAttempts(usr_id) {
        try {
            const forgotPasswordAttempts = await this.forgotPasswordAttemptsRepository.create({
                user: await this.userRepository.create({ usr_id }),
                fpa_attempts: 1,
                fpa_created_at: new Date(),
            })

            return await this.forgotPasswordAttemptsRepository.save(forgotPasswordAttempts, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getActiveRequest(usr_id) {
        try {
            return await this.forgotPasswordAttemptsRepository.findOne({
                where: {
                    user: { usr_id: usr_id },
                    fpa_completed: false
                },
                order: { fpa_created_at: 'DESC' },
            });
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async incrementAttempts(fpaID: number) {
        return await this.forgotPasswordAttemptsRepository
          .increment({ fpa_id: fpaID }, 'fpa_attempts', 1)
          .then(() => {
            return {
              message: 'Intento actualizado correctamente',
              statusCode: HttpStatus.OK,
            };
          })
          .catch((error) => {
            throw new BadRequestException({
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: [`${error.message}`],
              error: 'Error interno del servidor',
            });
          });
    }
    
    async completeRequest(fpaID: number) {
        return await this.forgotPasswordAttemptsRepository
          .update({ fpa_id: fpaID }, { fpa_completed: true })
          .then(() => {
            return {
              message: 'Solicitud marcada como completada correctamente',
              statusCode: HttpStatus.OK,
            };
          })
          .catch((error) => {
            throw new BadRequestException({
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: [`${error.message}`],
              error: 'Error interno del servidor',
            });
          });
      }
      
      
}