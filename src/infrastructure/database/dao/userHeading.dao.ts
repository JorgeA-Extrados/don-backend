import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Heading } from "src/heading/entities/heading.entity";
import { UserHeading } from "src/user-heading/entities/user-heading.entity";
import { User } from "src/user/entities/user.entity";
import { CreateUserHeadingDto } from "src/user-heading/dto/create-user-heading.dto";
import { SubHeading } from "src/sub-heading/entities/sub-heading.entity";



Injectable()
export class UserHeadingDao {

    constructor(
        @InjectRepository(UserHeading)
        private userHeadingRepository: Repository<UserHeading>,
        @InjectRepository(Heading)
        private headingRepository: Repository<Heading>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(SubHeading)
        private subHeadingRepository: Repository<SubHeading>,
    ) { }

    async createUserHeading(createUserHeadingDto) {
        try {
            const { usr_id, hea_id, sbh_id } = createUserHeadingDto
            const userHeading = await this.userHeadingRepository.create({
                ...createUserHeadingDto,
                user: this.userRepository.create({ usr_id }),
                heading: this.headingRepository.create({ hea_id }),
                ush_create: new Date(),
                ...(sbh_id && { subHeading: this.subHeadingRepository.create({ sbh_id }) }),
            })

            return await this.userHeadingRepository.save(userHeading, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getUserHeadingById(ushId: number) {
        try {
            const userHeading = await this.userHeadingRepository.findOne({
                where: {
                    ush_id: ushId,
                    ush_delete: IsNull(),
                    heading: { hea_delete: IsNull() }
                },
                relations: {
                    subHeading: true,
                    user: true,
                    heading: true
                }
            })

            return userHeading

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async findByUserAndHeading(usr_id: number, hea_id: number) {
        try {
            const userHeading = await this.userHeadingRepository.find({
                where: {
                    user: { usr_id },
                    heading: { hea_id, hea_delete: IsNull() },
                    ush_delete: IsNull()
                },
                relations: {
                    subHeading: true,
                    user: true,
                    heading: true
                }
            })

            return userHeading

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }


    async getUserHeadingByUserId(usrId: number) {
        try {
            const userHeading = await this.userHeadingRepository.find({
                where: {
                    user: { usr_id: usrId },
                    ush_delete: IsNull(),
                    heading: { hea_delete: IsNull() }
                },
                relations: {
                    subHeading: true,
                    user: true,
                    heading: true
                }
            })

            return userHeading

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getUserHeadingDeleteByUserId(usrId: number) {
        try {
            const userHeading = await this.userHeadingRepository.find({
                where: {
                    user: { usr_id: usrId },
                    heading: { hea_delete: IsNull() }
                },
                relations: {
                    subHeading: true,
                    user: true,
                    heading: true
                }
            })

            return userHeading

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllUserHeading() {
        try {
            const userHeading = await this.userHeadingRepository.find({
                where: {
                    ush_delete: IsNull(),
                    heading: { hea_delete: IsNull() }
                },
                relations: {
                    subHeading: true,
                    user: true,
                    heading: true
                }
            })

            return userHeading

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteUserHeading(ushId: number) {
        return await this.userHeadingRepository
            .update({ ush_id: ushId }, {
                ush_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Usuario-rubro eliminado satisfactoriamente',
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

    async deleteUserHeadingPhysicsById(ushId: number): Promise<void> {
        try {
            await this.userHeadingRepository.delete(ushId);
        } catch (error) {
             throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async updateUserHeading(ushId: number, updateUserHeadingDto) {
        return await this.userHeadingRepository
            .update(
                { ush_id: ushId },
                updateUserHeadingDto
            )
            .then(() => {
                return {
                    message: 'Usuario-rubro actualizado satisfactoriamente',
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

    async updateUserHeadingCreate(ushId: number, updateUserHeadingDto: { sbh_id: number }) {
        try {
            const updateData: any = {};

            if (updateUserHeadingDto.sbh_id !== undefined) {
                updateData.subHeading = this.subHeadingRepository.create({ sbh_id: updateUserHeadingDto.sbh_id });
            }

            await this.userHeadingRepository.update({ ush_id: ushId }, updateData);

            return {
                message: 'Usuario-rubro actualizado satisfactoriamente',
                statusCode: HttpStatus.CREATED,
            };

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }


}