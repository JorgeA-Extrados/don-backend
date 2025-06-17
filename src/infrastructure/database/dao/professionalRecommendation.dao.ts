import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { ProfessionalRecommendation } from "src/professional_recommendation/entities/professional_recommendation.entity";



Injectable()
export class ProfessionalRecommendationDao {

    constructor(
        @InjectRepository(ProfessionalRecommendation)
        private professionalRecommendationRepository: Repository<ProfessionalRecommendation>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findOne(fromUserId: number, toUserId: number): Promise<ProfessionalRecommendation | null> {
        return this.professionalRecommendationRepository.findOne({
            where: {
                from: { usr_id: fromUserId },
                to: { usr_id: toUserId },
            },
        });
    }

    async toggle(fromUserId: number, toUserId: number): Promise<{ recommended: boolean }> {
        const existing = await this.findOne(fromUserId, toUserId);

        if (existing) {
            await this.professionalRecommendationRepository.remove(existing);
            return { recommended: false };
        }

        const recommendation = this.professionalRecommendationRepository.create({
            from: await this.userRepository.create({ usr_id: fromUserId }),
            to: await this.userRepository.create({ usr_id: toUserId }),
            prr_create: new Date(),
        });

        await this.professionalRecommendationRepository.save(recommendation);
        return { recommended: true };
    }

    async countRecommendations(toUserId: number): Promise<number> {
        return this.professionalRecommendationRepository.count({
            where: { to: { usr_id: toUserId } },
        });
    }

    async deleteReportRecommendationsFisicaById(pubID: number): Promise<void> {
        try {
            await this.professionalRecommendationRepository.delete(pubID);
        } catch (error) {
             throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async getProfessionalRecommendationByUsrID(usrID: number) {
        try {
            const profesionalRecommendation = await this.professionalRecommendationRepository
                .createQueryBuilder('pr')
                .leftJoinAndSelect('pr.from', 'fromUser')
                .leftJoinAndSelect('pr.to', 'toUser')
                .where('(fromUser.usr_id = :usrID OR toUser.usr_id = :usrID)', { usrID })
                .andWhere('pr.prr_delete IS NULL')
                .getMany();

            return profesionalRecommendation;

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async getProfessionalRecommendationDeleteByUsrID(usrID: number) {
        try {
            const profesionalRecommendation = await this.professionalRecommendationRepository
                .createQueryBuilder('pr')
                .leftJoinAndSelect('pr.from', 'fromUser')
                .leftJoinAndSelect('pr.to', 'toUser')
                .where('(fromUser.usr_id = :usrID OR toUser.usr_id = :usrID)', { usrID })
                .getMany();

            return profesionalRecommendation;

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async delete(id: number) {
        return await this.professionalRecommendationRepository
            .update({ prr_id: id }, {
                prr_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Eliminado satisfactoriamente',
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