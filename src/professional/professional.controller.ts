import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, UseGuards, Request } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SearchProfessionalDto } from './dto/search-professional.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post('create')
  createProfessional(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalService.createProfessional(createProfessionalDto);
  }

  @Post(':pro_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(@Param('pro_id') pro_id: number, @UploadedFile() file: Express.Multer.File) {
    return await this.professionalService.updateProfilePicture(pro_id, file);
  }

  @Get('getAll')
  // @UseGuards(JwtAuthGuard)
  getAllProfessional() {
    return this.professionalService.getAllProfessional();
  }

  @Get('byId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getProfessionalById(@Param('id') id: string) {
    return this.professionalService.getProfessionalById(+id);
  }


  @Patch('delete/:id')
  // @UseGuards(JwtAuthGuard)
  deleteProfessional(@Param('id') id: string) {
    return this.professionalService.deleteProfessional(+id);
  }

  @Patch('update/:id')
  // @UseGuards(JwtAuthGuard)
  updateProfessional(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalService.updateProfessional(+id, updateProfessionalDto);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchProfessionals(@Query() searchProfessionalDto: SearchProfessionalDto, @Request() req) {
    return await this.professionalService.searchProfessionals(searchProfessionalDto, req);
  }
}
