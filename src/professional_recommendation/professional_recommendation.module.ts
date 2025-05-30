import { Module } from '@nestjs/common';
import { ProfessionalRecommendationService } from './professional_recommendation.service';
import { ProfessionalRecommendationController } from './professional_recommendation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalRecommendation } from './entities/professional_recommendation.entity';
import { ProfessionalRecommendationDao } from 'src/infrastructure/database/dao/professionalRecommendation.dao';
import { User } from 'src/user/entities/user.entity';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { ForgotPassword } from 'src/auth/entities/forgot-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalRecommendation, User, ForgotPassword])],
  controllers: [ProfessionalRecommendationController],
  providers: [ProfessionalRecommendationService, ProfessionalRecommendationDao, UserDao],
})
export class ProfessionalRecommendationModule {}
