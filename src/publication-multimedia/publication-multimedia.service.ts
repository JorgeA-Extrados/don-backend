import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublicationMultimediaDto } from './dto/create-publication-multimedia.dto';
import { UpdatePublicationMultimediaDto } from './dto/update-publication-multimedia.dto';
import { PublicationMultimediaDao } from 'src/infrastructure/database/dao/publication_multimedia.dao';

@Injectable()
export class PublicationMultimediaService {

  constructor(
    private readonly publicationMultimediaDao: PublicationMultimediaDao,
  ) { }


  async createPublicationMultimedia(createPublicationMultimediaDto: CreatePublicationMultimediaDto) {
    try {
      const pymePublicationMultimedia = await this.publicationMultimediaDao.createPublicationMultimedia(createPublicationMultimediaDto);

      return {
        message: 'Multimedia subido correctamente',
        statusCode: HttpStatus.OK,
        data: pymePublicationMultimedia,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

    async deletePublicationMultimedia(id: number) {
    try {
      await this.publicationMultimediaDao.deletePublicationMultimedia(id)

      return {
        message: 'Multimedia eliminado correctamente',
        statusCode: HttpStatus.OK,
      };

    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }
}
