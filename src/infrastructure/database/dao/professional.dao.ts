import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Professional } from "src/professional/entities/professional.entity";
import { User } from "src/user/entities/user.entity";
import { SearchProfessionalDto } from "src/professional/dto/search-professional.dto";



Injectable()
export class ProfessionalDao {

    constructor(
        @InjectRepository(Professional)
        private professionalRepository: Repository<Professional>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createProfessional(createProfessionalDto) {
        try {
            const { usr_id } = createProfessionalDto
            const professional = await this.professionalRepository.create({
                ...createProfessionalDto,
                user: await this.userRepository.create({ usr_id }),
                pro_create: new Date(),
            })

            return await this.professionalRepository.save(professional, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getProfessionalById(proID: number) {
        try {
            const professional = await this.professionalRepository.findOne({
                where: {
                    pro_id: proID,
                    pro_delete: IsNull()
                },
                relations: {
                    user: true
                },
                select: {
                    pro_id: true,
                    pro_firstName: true,
                    pro_lastName: true,
                    pro_latitude: true,
                    pro_longitude: true,
                    pro_profilePicture: true,
                    pro_creditDON: true,
                    user: {
                        usr_id: true,
                        usr_email: true,
                        usr_name: true,
                        usr_phone: true
                    }
                }
            })

            return professional

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getProfessionalByUsrId(usrID: number) {
        try {
            const professional = await this.professionalRepository.findOne({
                where: {
                    user: { usr_id: usrID },
                    pro_delete: IsNull()
                },
                relations: {
                    user: true
                },
                select: {
                    pro_id: true,
                    pro_firstName: true,
                    pro_lastName: true,
                    pro_latitude: true,
                    pro_longitude: true,
                    pro_profilePicture: true,
                    pro_creditDON: true,
                    user: {
                        usr_id: true,
                        usr_email: true,
                        usr_name: true,
                        usr_phone: true
                    }
                }
            })

            return professional

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllProfessional() {
        try {
            const professional = await this.professionalRepository.find({
                where: {
                    pro_delete: IsNull()
                },
                relations: {
                    user: true
                },
                select: {
                    pro_id: true,
                    pro_firstName: true,
                    pro_lastName: true,
                    pro_latitude: true,
                    pro_longitude: true,
                    pro_profilePicture: true,
                    pro_creditDON: true,
                    user: {
                        usr_id: true,
                        usr_email: true,
                        usr_name: true,
                        usr_phone: true
                    }
                }
            })

            return professional

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteProfessional(proID: number) {
        return await this.professionalRepository
            .update({ pro_id: proID }, {
                pro_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Profesional eliminado satisfactoriamente',
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

    async updateProfessional(proID: number, updateProfessionalDto) {

        return await this.professionalRepository
            .update(
                { pro_id: proID },
                updateProfessionalDto,
            )
            .then(() => {
                return {
                    message: 'Profesional actualizado satisfactoriamente',
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

    async searchProfessionals(searchProfessionalDto: SearchProfessionalDto, proID): Promise<Professional[]> {
        const { hea_id, lat, lng, radius = 10, searchText } = searchProfessionalDto;

        const professionals = await this.professionalRepository
            .createQueryBuilder('professional')
            .leftJoinAndSelect('professional.user', 'user')
            .leftJoinAndSelect('user.userHeading', 'userHeading')
            .leftJoinAndSelect('userHeading.heading', 'heading')
            .leftJoinAndSelect('heading.subHeading', 'subHeading')
            .where(qb => {
                const wheres: string[] = [];

                if (hea_id) {
                    wheres.push('heading.hea_id = :hea_id');
                    qb.setParameter('hea_id', hea_id);
                }

                if (lat && lng) {
                    wheres.push(`
                (
                  6371 * acos(
                    cos(radians(:lat)) * cos(radians(CAST(professional.pro_latitude AS float))) *
                    cos(radians(CAST(professional.pro_longitude AS float)) - radians(:lng)) +
                    sin(radians(:lat)) * sin(radians(CAST(professional.pro_latitude AS float)))
                  )
                ) <= :radius
              `);
                    qb.setParameter('lat', lat);
                    qb.setParameter('lng', lng);
                    qb.setParameter('radius', radius);
                }

                if (proID) {
                    wheres.push('professional.pro_id != :proID');
                    qb.setParameter('proID', proID);
                }

                if (searchText) {
                    const normalizedSearch = searchText
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, ''); // elimina acentos

                    const searchCondition = `
                        (
                        LOWER(heading.hea_name) LIKE :search OR
                        LOWER(subHeading.sbh_name) LIKE :search OR
                        LOWER(user.usr_name) LIKE :search OR
                        LOWER(user.usr_phone) LIKE :search OR
                        LOWER(professional.pro_firstName) LIKE :search
                        )
                    `;
                    wheres.push(searchCondition);
                    qb.setParameter('search', `%${normalizedSearch}%`);
                }

                return wheres.length ? wheres.join(' AND ') : '1=1';
            })
            .select([
                'professional.pro_id',
                'professional.pro_firstName',
                'professional.pro_lastName',
                'professional.pro_latitude',
                'professional.pro_longitude',
                'professional.pro_profilePicture',
                'professional.pro_description',
            ])
            .addSelect([
                'user.usr_id',
                'user.usr_email',
                'user.usr_phone',
            ])
            .addSelect([
                'userHeading.ush_id',
            ])
            .addSelect([
                'heading.hea_id',
                'heading.hea_name',
            ])
            .addSelect([
                'subHeading.sbh_id',
                'subHeading.sbh_name',
            ])
            .getMany();

        return professionals;
    }


}