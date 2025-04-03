import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { ServicesSearch } from "src/services-search/entities/services-search.entity";



Injectable()
export class ServicesSearchDao {

    constructor(
        @InjectRepository(ServicesSearch)
        private servicesSearchRepository: Repository<ServicesSearch>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createServicesSearch(createServicesSearchDto) {
        try {
            const {usr_id} = createServicesSearchDto
            const servicesSearch = await this.servicesSearchRepository.create({
                ...createServicesSearchDto,
                user: await this.userRepository.create({usr_id}),
                sea_create: new Date(),
            })

            return await this.servicesSearchRepository.save(servicesSearch, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Internal Server Error`,
            });
        }
    }

    async getServicesSearchById(seaID: number) {
        try {
            const servicesSearch = await this.servicesSearchRepository.findOne({
                where: {
                    sea_id: seaID,
                    sea_delete: IsNull()
                },
                relations: {
                    user: true
                },
                select: {
                    sea_id: true,
                    sea_firstName: true,
                    sea_lastName: true,
                    sea_latitude: true,
                    sea_longitude: true,
                    sea_profilePicture: true,
                    user: {
                        usr_id: true,
                        usr_email: true,
                        usr_name: true,
                        usr_phone: true
                    }
                }
            })

            return servicesSearch

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Internal Server Error`,
            });
        }
    }

    async getAllServicesSearch() {
        try {
            const servicesSearch = await this.servicesSearchRepository.find({
                where: {
                    sea_delete: IsNull()
                },
                relations: {
                    user: true
                },
                select: {
                    sea_id: true,
                    sea_firstName: true,
                    sea_lastName: true,
                    sea_latitude: true,
                    sea_longitude: true,
                    sea_profilePicture: true,
                    user: {
                        usr_id: true,
                        usr_email: true,
                        usr_name: true,
                        usr_phone: true
                    }
                }
            })

            return servicesSearch

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Internal Server Error`,
            });
        }
    }

    async deleteServicesSearch(seaID: number) {
        return await this.servicesSearchRepository
            .update({ sea_id: seaID }, {
                sea_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'ServicesSearch delete successfully',
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

    async updateServicesSearch(seaID: number, updateServicesSearchDto) {

        return await this.servicesSearchRepository
            .update(
                { sea_id: seaID },
                updateServicesSearchDto
            )
            .then(() => {
                return {
                    message: 'ServicesSearch updated successfully',
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