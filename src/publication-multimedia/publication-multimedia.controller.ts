import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PublicationMultimediaService } from './publication-multimedia.service';
import { CreatePublicationMultimediaDto } from './dto/create-publication-multimedia.dto';
import { UpdatePublicationMultimediaDto } from './dto/update-publication-multimedia.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('publication-multimedia')
export class PublicationMultimediaController {
  constructor(private readonly publicationMultimediaService: PublicationMultimediaService) { }

  @Post('/create/pymePublicationMultimedia')
  createPymePublicationMultimedia(@Body() createPublicationMultimediaDto: CreatePublicationMultimediaDto) {
    return this.publicationMultimediaService.createPublicationMultimedia(createPublicationMultimediaDto);
  }

  @Patch('delete/pymePublicationMultimedia/:id')
  @UseGuards(JwtAuthGuard)
  deletePymePublicationMultimedia(@Param('id') id: string) {
    return this.publicationMultimediaService.deletePublicationMultimedia(+id);
  }

}
