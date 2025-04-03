import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubHeadingService } from './sub-heading.service';
import { CreateSubHeadingDto } from './dto/create-sub-heading.dto';
import { UpdateSubHeadingDto } from './dto/update-sub-heading.dto';

@Controller('sub-heading')
export class SubHeadingController {
  constructor(private readonly subHeadingService: SubHeadingService) {}

  @Post('create')
  createSubHeading(@Body() createSubHeadingDto: CreateSubHeadingDto) {
    return this.subHeadingService.createSubHeading(createSubHeadingDto);
  }

  @Get('getAll')
  // @UseGuards(JwtAuthGuard)
  getAllSubHeading() {
    return this.subHeadingService.getAllSubHeading();
  }

  @Get('byId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getSubHeadingById(@Param('id') id: string) {
    return this.subHeadingService.getSubHeadingById(+id);
  }


  @Patch('delete/:id')
  // @UseGuards(JwtAuthGuard)
  deleteSubHeading(@Param('id') id: string) {
    return this.subHeadingService.deleteSubHeading(+id);
  }

  @Patch('update/:id')
  // @UseGuards(JwtAuthGuard)
  updateSubHeading(@Param('id') id: string, @Body() updateSubHeadingDto: UpdateSubHeadingDto) {
    return this.subHeadingService.updateSubHeading(+id, updateSubHeadingDto);
  }
}
