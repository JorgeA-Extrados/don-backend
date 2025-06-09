import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionalRecommendationDto } from './create-professional_recommendation.dto';

export class UpdateProfessionalRecommendationDto extends PartialType(CreateProfessionalRecommendationDto) {}
