import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportReasonService } from './report-reason.service';
import { CreateReportReasonDto } from './dto/create-report-reason.dto';
import { UpdateReportReasonDto } from './dto/update-report-reason.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('report-reason')
export class ReportReasonController {
  constructor(private readonly reportReasonService: ReportReasonService) { }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createReportReason(@Body() createReportReasonDto: CreateReportReasonDto) {
    return this.reportReasonService.createReportReason(createReportReasonDto);
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  deleteReportReason(@Param('id') id: string) {
    return this.reportReasonService.deleteReportReason(+id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  updateReportReason(@Param('id') id: string, @Body() updateReportReasonDto: UpdateReportReasonDto) {
    return this.reportReasonService.updateReportReason(+id, updateReportReasonDto);
  }
}
