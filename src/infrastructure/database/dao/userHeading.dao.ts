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

    async createUserHeading(createUserHeadingDto: CreateUserHeadingDto) {
        try {
            const {usr_id, hea_id, sbh_id} = createUserHeadingDto
            const userHeading = await this.userHeadingRepository.create({
                ...createUserHeadingDto,
                user: this.userRepository.create({usr_id}),
                heading: this.headingRepository.create({hea_id}),
                ush_create: new Date(),
                ...(sbh_id && { subHeading: this.subHeadingRepository.create({ sbh_id }) }),
            })

            return await this.userHeadingRepository.save(userHeading, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Internal Server Error`,
            });
        }
    }

    async getUserHeadingById(ushId: number) {
        try {
            const userHeading = await this.userHeadingRepository.findOne({
                where: {
                    ush_id: ushId,
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
                error: `Internal Server Error`,
            });
        }
    }

    async getUserHeadingByUserId(usrId: number) {
        try {
            const userHeading = await this.userHeadingRepository.find({
                where: {
                    user: {usr_id: usrId},
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
                error: `Internal Server Error`,
            });
        }
    }

    async getAllUserHeading() {
        try {
            const userHeading = await this.userHeadingRepository.find({
                where: {
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
                error: `Internal Server Error`,
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
                    message: 'User Heading delete successfully',
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

    async updateUserHeading(ushId: number, updateUserHeadingDto) {
        return await this.userHeadingRepository
            .update(
                { ush_id: ushId },
                updateUserHeadingDto
            )
            .then(() => {
                return {
                    message: 'User Heading updated successfully',
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

}