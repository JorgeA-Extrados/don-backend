import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Publication } from "src/publication/entities/publication.entity";



Injectable()
export class PublicationDao {

    constructor(
        @InjectRepository(Publication)
        private publicationRepository: Repository<Publication>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createPublication(createPublicationDto) {
        try {
            const {usr_id} = createPublicationDto
            const publication = await this.publicationRepository.create({
                ...createPublicationDto,
                user: await this.userRepository.create({usr_id}),
                pub_create: new Date(),
            })

            return await this.publicationRepository.save(publication, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getPublicationById(pubID: number) {
        try {
            const publication = await this.publicationRepository.findOne({
                where: {
                    pub_id: pubID,
                    pub_delete: IsNull()
                },
                relations: {
                    user: {
                        professional: true,
                        supplier: true
                    }
                },
                select: {
                    pub_id: true,
                    pub_image: true,
                    pub_description: true,
                    pub_create: true,
                    user: {
                        usr_id: true,
                        usr_email: true,
                        usr_invitationCode: true,
                        usr_name: true,
                        usr_role: true,
                        usr_phone: true,
                        professional: {
                            pro_profilePicture: true,
                        },
                        supplier: {
                            sup_profilePicture: true
                        }
                    }
                }
            })

            return publication

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllPublication() {
        try {
            const publication = await this.publicationRepository.find({
                where: {
                    pub_delete: IsNull()
                }, 
                relations: {
                    user: {
                        professional: true,
                        supplier: true
                    }
                },
                select: {
                    pub_id: true,
                    pub_image: true,
                    pub_description: true,
                    pub_create: true,
                    user: {
                        usr_id: true,
                        usr_email: true,
                        usr_invitationCode: true,
                        usr_name: true,
                        usr_role: true,
                        usr_phone: true,
                        professional: {
                            pro_profilePicture: true,
                        },
                        supplier: {
                            sup_profilePicture: true
                        }
                    }
                },
                order: {
                    pub_create: 'DESC' // opcional: historial ordenado
                }
            })

            return publication

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deletePublication(pubID: number) {
        return await this.publicationRepository
            .update({ pub_id: pubID }, {
                pub_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Publicacion eliminada satisfactoriamente',
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

    async updatePublication(pubID: number, updatePublicationDto) {

        return await this.publicationRepository
            .update(
                { pub_id: pubID },
                updatePublicationDto
            )
            .then(() => {
                return {
                    message: 'Pubicacion actualizada satisfactoriamente',
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

}