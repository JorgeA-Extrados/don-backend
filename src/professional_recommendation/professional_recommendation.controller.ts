import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProfessionalRecommendationService } from './professional_recommendation.service';
import { CreateProfessionalRecommendationDto } from './dto/create-professional_recommendation.dto';
import { UpdateProfessionalRecommendationDto } from './dto/update-professional_recommendation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('professional-recommendation')
export class ProfessionalRecommendationController {
  constructor(private readonly professionalRecommendationService: ProfessionalRecommendationService) { }

  @UseGuards(JwtAuthGuard)
  @Post(':toUserId')
  async toggle(@Param('toUserId') toUserId: number, @Req() req: Request) {
    return this.professionalRecommendationService.toggleRecommendation(req, toUserId);
  }

  @Get(':userId/count')
  @UseGuards(JwtAuthGuard)
  async count(@Param('userId') userId: number) {
    return this.professionalRecommendationService.getRecommendationCount(userId);
  }
}
