import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ServicesSearchService } from './services-search.service';
import { CreateServicesSearchDto } from './dto/create-services-search.dto';
import { UpdateServicesSearchDto } from './dto/update-services-search.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('services-search')
export class ServicesSearchController {
  constructor(private readonly servicesSearchService: ServicesSearchService) { }

  @Post('create')
  createServicesSearch(@Body() createServicesSearchDto: CreateServicesSearchDto) {
    return this.servicesSearchService.createServicesSearch(createServicesSearchDto);
  }

  @Post(':sea_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(@Param('sea_id') sea_id: number, @UploadedFile() file: Express.Multer.File) {
    return await this.servicesSearchService.updateProfilePicture(sea_id, file);
  }

  @Get('getAll')
  // @UseGuards(JwtAuthGuard)
  getAllServicesSearch() {
    return this.servicesSearchService.getAllServicesSearch();
  }

  @Get('byId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getServicesSearchById(@Param('id') id: string) {
    return this.servicesSearchService.getServicesSearchById(+id);
  }


  @Patch('delete/:id')
  // @UseGuards(JwtAuthGuard)
  deleteServicesSearch(@Param('id') id: string) {
    return this.servicesSearchService.deleteServicesSearch(+id);
  }

  @Patch('update/:id')
  // @UseGuards(JwtAuthGuard)
  updateServicesSearch(@Param('id') id: string, @Body() updateServicesSearchDto: UpdateServicesSearchDto) {
    return this.servicesSearchService.updateServicesSearch(+id, updateServicesSearchDto);
  }
}
