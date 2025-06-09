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

}