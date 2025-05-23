import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreditsReasonService } from './credits-reason.service';
import { CreateCreditsReasonDto } from './dto/create-credits-reason.dto';
import { UpdateCreditsReasonDto } from './dto/update-credits-reason.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('credits-reason')
export class CreditsReasonController {
  constructor(private readonly creditsReasonService: CreditsReasonService) { }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createCreditsReason(@Body() createCreditsReasonDto: CreateCreditsReasonDto) {
    return this.creditsReasonService.createCreditsReason(createCreditsReasonDto);
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  getAllCreditsReason() {
    return this.creditsReasonService.getAllCreditsReason();
  }

  @Get('byId/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getCreditsReasonById(@Param('id') id: string) {
    return this.creditsReasonService.getCreditsReasonById(+id);
  }


  @Patch('delete/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  deleteCreditsReason(@Param('id') id: string) {
    return this.creditsReasonService.deleteCreditsReason(+id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  updateCreditsReason(@Param('id') id: string, @Body() updateCreditsReasonDto: UpdateCreditsReasonDto) {
    return this.creditsReasonService.updateCreditsReason(+id, updateCreditsReasonDto);
  }
}
