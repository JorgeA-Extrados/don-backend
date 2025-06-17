import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { ForgotPasswordAttempts } from "src/auth/entities/forgot_password_attempts.entity";
import { UserVerificationAttempts } from "src/auth/entities/user_verification_attempts.entity";



Injectable()
export class UserVerificationAttemptsDao {

    constructor(
        @InjectRepository(UserVerificationAttempts)
        private userVerificationAttemptsRepository: Repository<UserVerificationAttempts>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createForgotPasswordAttempts(usr_id) {
        try {
            const userVerificationAttempts = await this.userVerificationAttemptsRepository.create({
                user: await this.userRepository.create({ usr_id }),
                uva_created_at: new Date(),
            })

            return await this.userVerificationAttemptsRepository.save(userVerificationAttempts, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getActiveAttempts(usr_id) {
        try {
            return await this.userVerificationAttemptsRepository.count({
                where: {
                    user: { usr_id: usr_id },
                },
            });
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getUserVerification(usr_id) {
        try {
            return await this.userVerificationAttemptsRepository.find({
                where: {
                    user: { usr_id: usr_id },
                },
            });
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    // Marcar los intentos de verificación como completados
    async completeVerificationAttempt(userId: number) {
        try {
            const attempts = await this.userVerificationAttemptsRepository.find({
                where: {
                    user: { usr_id: userId },
                },
            });

            attempts.forEach(async (attempt) => {
                attempt.uva_completed = true; // Si tienes un campo de completado
                await this.userVerificationAttemptsRepository.save(attempt);
            });
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteForgotPasswordAttemptsFisicaById(pubID: number): Promise<void> {
        try {
            await this.userVerificationAttemptsRepository.delete(pubID);
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }



}