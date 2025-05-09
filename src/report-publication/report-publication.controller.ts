import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportPublicationService } from './report-publication.service';
import { CreateReportPublicationDto } from './dto/create-report-publication.dto';
import { UpdateReportPublicationDto } from './dto/update-report-publication.dto';
import { CreateChangeOfStateDto } from './dto/change-of-state.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('report-publication')
export class ReportPublicationController {
  constructor(private readonly reportPublicationService: ReportPublicationService) { }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createReportPublication(@Body() createReportPublicationDto: CreateReportPublicationDto) {
    return this.reportPublicationService.createReportPublication(createReportPublicationDto);
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllReportPublication() {
    return this.reportPublicationService.getAllReportPublication();
  }

  @Get('byId/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getReportPublicationById(@Param('id') id: string) {
    return this.reportPublicationService.getReportPublicationById(+id);
  }


  @Patch('delete/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  deleteReportPublication(@Param('id') id: string) {
    return this.reportPublicationService.deleteReportPublication(+id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  updateReportPublication(@Param('id') id: string, @Body() updateReportPublicationDto: UpdateReportPublicationDto) {
    return this.reportPublicationService.updateReportPublication(+id, updateReportPublicationDto);
  }

  @Get('publication/byId/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getReportPublicationByPUBID(@Param('id') id: string) {
    return this.reportPublicationService.getReportPublicationByPUBID(+id);
  }

  @Patch('update-state')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateReportsByState(@Body() createChangeOfStateDto: CreateChangeOfStateDto) {
    return this.reportPublicationService.updateReportsByAction(createChangeOfStateDto);
  }

  @Get('pending-reported-publications')
  @UseGuards(JwtAuthGuard)
  async getAllPendingReportedPublications() {
    return this.reportPublicationService.getAllPendingReportedPublications();
  }

}
