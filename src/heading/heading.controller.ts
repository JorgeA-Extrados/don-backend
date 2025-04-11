import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HeadingService } from './heading.service';
import { CreateHeadingDto } from './dto/create-heading.dto';
import { UpdateHeadingDto } from './dto/update-heading.dto';

@Controller('heading')
export class HeadingController {
  constructor(private readonly headingService: HeadingService) {}

  @Post('create')
  createHeading(@Body() createHeadingDto: CreateHeadingDto) {
    return this.headingService.createHeading(createHeadingDto);
  }

  @Get('getAllProfessional')
  // @UseGuards(JwtAuthGuard)
  getAllHeadingProfessional() {
    return this.headingService.getAllHeadingProfessional();
  }

  @Get('getAllSupplier')
  // @UseGuards(JwtAuthGuard)
  getAllHeadingSupplier() {
    return this.headingService.getAllHeadingSupplier();
  }

  @Get('byId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getHeadingById(@Param('id') id: string) {
    return this.headingService.getHeadingById(+id);
  }


  @Patch('delete/:id')
  // @UseGuards(JwtAuthGuard)
  deleteHeading(@Param('id') id: string) {
    return this.headingService.deleteHeading(+id);
  }

  @Patch('update/:id')
  // @UseGuards(JwtAuthGuard)
  updateHeading(@Param('id') id: string, @Body() updateHeadingDto: UpdateHeadingDto) {
    return this.headingService.updateHeading(+id, updateHeadingDto);
  }
}
