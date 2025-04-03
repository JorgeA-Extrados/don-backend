import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicesSearchService } from './services-search.service';
import { CreateServicesSearchDto } from './dto/create-services-search.dto';
import { UpdateServicesSearchDto } from './dto/update-services-search.dto';

@Controller('services-search')
export class ServicesSearchController {
  constructor(private readonly servicesSearchService: ServicesSearchService) {}

 @Post('create')
 createServicesSearch(@Body() createServicesSearchDto: CreateServicesSearchDto) {
    return this.servicesSearchService.createServicesSearch(createServicesSearchDto);
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
