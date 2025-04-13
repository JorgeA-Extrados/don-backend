import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publication')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

   @Post('create')
   createPublication(@Body() createPublicationDto: CreatePublicationDto) {
     return this.publicationService.createPublication(createPublicationDto);
   }
 
   @Post(':pub_id/upload')
   @UseInterceptors(FileInterceptor('file'))
   async uploadPublicationPicture(@Param('pub_id') pub_id: number, @UploadedFile() file: Express.Multer.File) {
     return await this.publicationService.uploadPublicationPicture(pub_id, file);
   }
 
   @Get('getAll')
   // @UseGuards(JwtAuthGuard)
   getAllPublication() {
     return this.publicationService.getAllPublication();
   }
 
   @Get('byId/:id')
   // @UseGuards(JwtAuthGuard, RolesGuard) 
   // @Roles('admin')
   getPublicationById(@Param('id') id: string) {
     return this.publicationService.getPublicationById(+id);
   }
 
 
   @Patch('delete/:id')
   // @UseGuards(JwtAuthGuard)
   deletePublication(@Param('id') id: string) {
     return this.publicationService.deletePublication(+id);
   }
 
   @Patch('update/:id')
   // @UseGuards(JwtAuthGuard)
   updatePublication(@Param('id') id: string, @Body() updatePublicationDto: UpdatePublicationDto) {
     return this.publicationService.updatePublication(+id, updatePublicationDto);
   }
}
