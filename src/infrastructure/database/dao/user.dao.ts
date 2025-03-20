import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { getHashedPassword } from "src/user/user.utils";



Injectable()
export class UserDao {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }


    async createUser(createUserDto) {
        try {
            const { usr_email, usr_password, usr_verification_code, usr_name } = createUserDto;
            const newEmail = usr_email.toLowerCase()

            let user;

            if (usr_password) {

                const hashedPassword = await getHashedPassword(usr_password);
                user = this.userRepository.create({
                    usr_email: newEmail,
                    usr_password: hashedPassword,
                    usr_name: usr_name,
                    usr_create: new Date(),
                    usr_verification_code
                })
            } else {
                // Si la contraseña es nula (usuario de Google), guárdala como nula 
                user = this.userRepository.create({
                    usr_email: newEmail,
                    usr_name: usr_name,
                    usr_create: new Date(),
                    usr_verification_code
                });
            }

            return await this.userRepository.save(user, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `User not found`,
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
                    usr_firstName: true,
                    usr_lastName: true,
                    usr_address: true,
                    usr_name: true,
                    usr_role: true,
                    usr_profilePicture: true,
                    usr_phone: true,
                    usr_creditDON: true,
                    usr_active: true,
                    usr_verification_code: true
                }
            })

            return user

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `User not found`,
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
                    usr_firstName: true,
                    usr_lastName: true,
                    usr_address: true,
                    usr_name: true,
                    usr_role: true,
                    usr_profilePicture: true,
                    usr_phone: true,
                    usr_creditDON: true,
                    usr_active: true,
                }
            })

            return user

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `User not found`,
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
                error: `User not found`,
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
                error: `User not found`,
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
                    message: 'User delete successfully',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Internal Server Error',
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
                    message: 'User updated successfully',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Internal Server Error',
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
                    message: 'User confirm successfully',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Internal Server Error',
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
                error: `User not found`,
            });
        }
    }

}