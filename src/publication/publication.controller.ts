import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('publication')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) { }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createPublication(@Body() createPublicationDto: CreatePublicationDto) {
    return this.publicationService.createPublication(createPublicationDto);
  }

  @Post(':pub_id/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPublicationPicture(@Param('pub_id') pub_id: number, @UploadedFile() file: Express.Multer.File) {
    return await this.publicationService.uploadPublicationPicture(pub_id, file);
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  getAllPublication() {
    return this.publicationService.getAllPublication();
  }

  @Get('byId/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getPublicationById(@Param('id') id: string) {
    return this.publicationService.getPublicationById(+id);
  }


  @Patch('delete/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  deletePublication(@Param('id') id: string) {
    return this.publicationService.deletePublication(+id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  updatePublication(@Param('id') id: string, @Body() updatePublicationDto: UpdatePublicationDto) {
    return this.publicationService.updatePublication(+id, updatePublicationDto);
  }


  @Get('byUserId/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getPublicationByUserId(@Param('id') id: string) {
    return this.publicationService.getPublicationByUserId(+id);
  }

  @Get('byUserIdReport/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getPublicationByUserIdReport(@Param('id') id: string) {
    return this.publicationService.getPublicationByUserIdReport(+id);
  }
}
