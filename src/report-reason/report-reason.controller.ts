import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportReasonService } from './report-reason.service';
import { CreateReportReasonDto } from './dto/create-report-reason.dto';
import { UpdateReportReasonDto } from './dto/update-report-reason.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('report-reason')
export class ReportReasonController {
  constructor(private readonly reportReasonService: ReportReasonService) { }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin')
  createReportReason(@Body() createReportReasonDto: CreateReportReasonDto) {
    return this.reportReasonService.createReportReason(createReportReasonDto);
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getAllReportReason() {
    return this.reportReasonService.getAllReportReason();
  }

  @Get('byId/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getReportReasonById(@Param('id') id: string) {
    return this.reportReasonService.getReportReasonById(+id);
  }


  @Patch('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin')
  deleteReportReason(@Param('id') id: string) {
    return this.reportReasonService.deleteReportReason(+id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin')
  updateReportReason(@Param('id') id: string, @Body() updateReportReasonDto: UpdateReportReasonDto) {
    return this.reportReasonService.updateReportReason(+id, updateReportReasonDto);
  }
}
