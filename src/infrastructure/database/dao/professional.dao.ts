import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { Professional } from "src/professional/entities/professional.entity";
import { User } from "src/user/entities/user.entity";



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
            const {usr_id} = createProfessionalDto
            const professional = await this.professionalRepository.create({
                ...createProfessionalDto,
                user: await this.userRepository.create({usr_id}),
                pro_create: new Date(),
            })

            return await this.professionalRepository.save(professional, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Internal Server Error`,
            });
        }
    }

    async getProfessionalById(proID: number) {
        try {
            const professional = await this.professionalRepository.findOne({
                where: {
                    pro_id: proID,
                    pro_delete: IsNull()
                }
            })

            return professional

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Internal Server Error`,
            });
        }
    }

    async getAllProfessional() {
        try {
            const professional = await this.professionalRepository.find({
                where: {
                    pro_delete: IsNull()
                }
            })

            return professional

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Internal Server Error`,
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
                    message: 'Professional delete successfully',
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

    async updateProfessional(proID: number, updateProfessionalDto) {

        return await this.professionalRepository
            .update(
                { pro_id: proID },
                updateProfessionalDto
            )
            .then(() => {
                return {
                    message: 'Professional updated successfully',
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