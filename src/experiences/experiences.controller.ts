import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) { }

  @Post('create')
  createExperience(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experiencesService.createExperience(createExperienceDto);
  }

  @Get('getAll')
  // @UseGuards(JwtAuthGuard)
  getAllExperience() {
    return this.experiencesService.getAllExperience();
  }

  @Get('byId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getExperienceById(@Param('id') id: string) {
    return this.experiencesService.getExperienceById(+id);
  }


  @Patch('delete/:id')
  // @UseGuards(JwtAuthGuard)
  deleteExperience(@Param('id') id: string) {
    return this.experiencesService.deleteExperience(+id);
  }

  @Patch('update/:id')
  // @UseGuards(JwtAuthGuard)
  updateExperience(@Param('id') id: string, @Body() updateExperienceDto: UpdateExperienceDto) {
    return this.experiencesService.updateExperience(+id, updateExperienceDto);
  }
}
