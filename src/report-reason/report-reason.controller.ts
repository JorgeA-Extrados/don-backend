import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportReasonService } from './report-reason.service';
import { CreateReportReasonDto } from './dto/create-report-reason.dto';
import { UpdateReportReasonDto } from './dto/update-report-reason.dto';

@Controller('report-reason')
export class ReportReasonController {
  constructor(private readonly reportReasonService: ReportReasonService) {}

   @Post('create')
   createReportReason(@Body() createReportReasonDto: CreateReportReasonDto) {
     return this.reportReasonService.createReportReason(createReportReasonDto);
   }
 
   @Get('getAll')
   // @UseGuards(JwtAuthGuard)
   getAllReportReason() {
     return this.reportReasonService.getAllReportReason();
   }
 
   @Get('byId/:id')
   // @UseGuards(JwtAuthGuard, RolesGuard) 
   // @Roles('admin')
   getReportReasonById(@Param('id') id: string) {
     return this.reportReasonService.getReportReasonById(+id);
   }
 
 
   @Patch('delete/:id')
   // @UseGuards(JwtAuthGuard)
   deleteReportReason(@Param('id') id: string) {
     return this.reportReasonService.deleteReportReason(+id);
   }
 
   @Patch('update/:id')
   // @UseGuards(JwtAuthGuard)
   updateReportReason(@Param('id') id: string, @Body() updateReportReasonDto: UpdateReportReasonDto) {
     return this.reportReasonService.updateReportReason(+id, updateReportReasonDto);
   }
}
