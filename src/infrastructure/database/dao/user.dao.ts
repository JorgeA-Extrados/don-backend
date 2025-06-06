import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { getHashedPassword } from "src/user/user.utils";
import { ForgotPassword } from "src/auth/entities/forgot-password.entity";



Injectable()
export class UserDao {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ForgotPassword)
        private forgotPasswordRepository: Repository<ForgotPassword>,
    ) { }


    async createUser(createUserDto) {
        try {
            const { usr_email, usr_password, usr_verification_code, usr_phone, usr_over, usr_terms, usr_invitationCode } = createUserDto;
            const newEmail = usr_email.toLowerCase()

            let user;

            if (usr_password) {
                const hashedPassword = await getHashedPassword(usr_password);
                user = this.userRepository.create({
                    usr_email: newEmail,
                    usr_password: hashedPassword,
                    usr_phone,
                    usr_create: new Date(),
                    usr_verification_code,
                    usr_over,
                    usr_terms,
                    usr_invitationCode
                })
            } else {
                // Si la contraseña es nula (usuario de Google), guárdala como nula 
                user = this.userRepository.create({
                    usr_email: newEmail,
                    usr_phone,
                    usr_create: new Date(),
                    usr_verification_code,
                    usr_over,
                    usr_terms,
                    usr_invitationCode
                });
            }

            return await this.userRepository.save(user, { reload: true })

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getUserById(usrId: number) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    usr_id: usrId,
                    usr_delete: IsNull()
                },
                select: {
                    usr_id: true,
                    usr_email: true,
                    usr_invitationCode: true,
                    //usr_firstName: true,
                    //usr_lastName: true,
                    //usr_address: true,
                    // usr_name: true,
                    usr_role: true,
                    //usr_profilePicture: true,
                    usr_phone: true,
                    //usr_creditDON: true,
                    // usr_active: true,
                    usr_verification_code: true,
                    usr_verified: true
                }
            })

            return user

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllUser() {
        try {
            const user = await this.userRepository.find({
                where: {
                    usr_delete: IsNull()
                },
                select: {
                    usr_id: true,
                    usr_email: true,
                    usr_invitationCode: true,
                    //usr_firstName: true,
                    //usr_lastName: true,
                    //usr_address: true,
                    //usr_name: true,
                    usr_role: true,
                    //usr_profilePicture: true,
                    usr_phone: true,
                    //usr_creditDON: true,
                    // usr_active: true,
                }
            })

            return user

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    usr_email: email,
                    usr_delete: IsNull()
                }
            })

            return user

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getUserByName(name: string) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    usr_name: name,
                    usr_delete: IsNull()
                }
            })

            return user

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteUser(usrId: number) {
        return await this.userRepository
            .update({ usr_id: usrId }, {
                usr_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Usuario eliminado satisfactoriamente',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Error Interno del Servidor',
                });
            });
    }

    async updateUser(usrId: number, updateUserDto) {

        return await this.userRepository
            .update(
                { usr_id: usrId },
                updateUserDto
            )
            .then(() => {
                return {
                    message: 'Usuario actualizado satisfactoriamente',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Error Interno del Servidor',
                });
            });
    }

    async confirmUser(usrId: number) {
        return await this.userRepository
            .update({ usr_id: usrId }, {
                usr_verified: true
            })
            .then(() => {
                return {
                    message: 'Usuario confirmado satisfactoriamente',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Error Interno del Servidor',
                });
            });
    }

    async isConfirmUser(usrId: number) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    usr_id: usrId,
                    usr_verified: true,
                    usr_delete: IsNull()
                }
            })

            return user

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async updateUserPassword(updatePassword) {
        const { userId, hashedPassword, fopId } = updatePassword
        return await this.userRepository
            .update(
                { usr_id: userId },
                {
                    usr_password: hashedPassword,
                },
            )
            .then(async () => {
                await this.forgotPasswordRepository.update({ fop_id: fopId }, { fop_code_used: new Date(), fop_is_active: false })
                return {
                    message: 'Cambio de contraseña correcto',
                    statusCode: HttpStatus.OK
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Error Interno del Servidor',
                });
            });
    }

    
    async getUserByInvitationCode(code: string) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    usr_invitationCode: code,
                    usr_delete: IsNull()
                }
            })

            return user

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

}