import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ForgotPassword } from "src/auth/entities/forgot-password.entity";
import { User } from "src/user/entities/user.entity";

import { Between, IsNull, Repository } from "typeorm";

@Injectable()
export class ForgotPasswordDao {

    constructor(
        @InjectRepository(ForgotPassword)
        private forgotPasswordRepository: Repository<ForgotPassword>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }


    async createForgotPassword(createForgotPassword) {
        try {
            const { currentDate, userId, numericalCode } = createForgotPassword
            const codeEmail = this.forgotPasswordRepository.create({
                fop_code: numericalCode,
                fop_date_expiry: currentDate,
                usrID: this.userRepository.create({ usr_id: userId })
            })

            const emailVeri = await this.forgotPasswordRepository
                .save(codeEmail, { reload: true })

            return emailVeri
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getForgotPasswordByUserIdAndCode(getforgotPassword) {
        try {
            const { userId, code, newDate, currentDate } = getforgotPassword
            const getcode = await this.forgotPasswordRepository.findOne({
                where: [
                    {
                        usrID: { usr_id: userId },
                        fop_code: code,
                        fop_date_expiry: Between(newDate, currentDate),
                        fop_is_active: IsNull()
                    }
                ],
                relations: {
                    usrID: true
                }
            })

            return getcode
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async updateForgotPassword(fopId, update) {
        try {
            return await this.forgotPasswordRepository.update({ fop_id: fopId }, update)
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async getForgotPasswordByFopId(fopId: number) {
        try {
            const authorizedCode = await this.forgotPasswordRepository.findOne({
                where: {
                    fop_id: fopId
                }
            });

            return authorizedCode
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async getForgotPasswordByUserId(userId: number) {
        try {
            const userCodes = await this.forgotPasswordRepository.find({
                where: {
                    usrID: { usr_id: userId },
                    fop_is_active: IsNull()
                }
            });

            return userCodes
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async getForgotPasswordDeleteByUserId(userId: number) {
        try {
            const userCodes = await this.forgotPasswordRepository.find({
                where: {
                    usrID: { usr_id: userId },
                }
            });

            return userCodes
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async getForgotPasswordByUserIdAndChangeTime(changetime) {
        try {
            const { userId, newDate, currentDate } = changetime
            const code = await this.forgotPasswordRepository.findOne({
                where: [
                    {
                        usrID: { usr_id: userId },
                        fop_change_time: Between(newDate, currentDate),
                        fop_is_active: true
                    }
                ],
                relations: {
                    usrID: true
                }
            })

            return code
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async deleteForgotPasswordFisicaById(fopId: number): Promise<void> {
        try {
            await this.forgotPasswordRepository.delete(fopId);
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }


}