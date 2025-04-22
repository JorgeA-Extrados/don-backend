import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { FirebaseService } from 'src/infrastructure/config/firebase.service';
import { PublicationDao } from 'src/infrastructure/database/dao/publication.dao';

@Injectable()
export class PublicationService {

  constructor(
    private readonly publicationDao: PublicationDao,
    private readonly firebaseService: FirebaseService,
  ) { }

  async createPublication(createPublicationDto: CreatePublicationDto) {

    const publication = await this.publicationDao.createPublication(createPublicationDto);

    return {
      message: 'Publicación',
      statusCode: HttpStatus.OK,
      data: publication,
    };
  }

  async uploadPublicationPicture(pub_id: number, file: Express.Multer.File) {

    try {
      const publication = await this.publicationDao.getPublicationById(pub_id);

      if (!publication) {
        throw new UnauthorizedException('Publicación no encontrada')
      }

      const imageUrl = await this.firebaseService.uploadFile(file, pub_id);

      const updateImg = {
        pub_image: imageUrl
      }


      await this.publicationDao.updatePublication(pub_id, updateImg)

      const newPublication = await this.publicationDao.getPublicationById(pub_id)

      return {
        message: 'Imagen de la publicación actualizada con éxito',
        statusCode: HttpStatus.OK,
        data: newPublication
      };
    } catch (error) {

      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getPublicationById(id: number) {
    try {
      const publication = await this.publicationDao.getPublicationById(id);

      if (!publication) {
        throw new UnauthorizedException('Publicación no encontrada')
      }

      const { user } = publication;

      const usr_profilePicture =
        user?.professional?.pro_profilePicture ??
        user?.supplier?.sup_profilePicture ??
        null;

      const transformed = {
        ...publication,
        user: {
          usr_id: user.usr_id,
          usr_email: user.usr_email,
          usr_invitationCode: user.usr_invitationCode,
          usr_name: user.usr_name,
          usr_role: user.usr_role,
          usr_phone: user.usr_phone,
          usr_profilePicture
        }
      };

      return {
        message: 'Publicación',
        statusCode: HttpStatus.OK,
        data: transformed,
      };
    } catch (error) {

      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllPublication() {
    try {
      const publication = await this.publicationDao.getAllPublication();

      if (publication.length === 0) {
        throw new UnauthorizedException('Publicaciones no encontradas')
      }

      const transformed = publication.map((pub) => {
        const { professional, supplier, ...userBase } = pub.user;

        const usr_profilePicture = professional?.pro_profilePicture || supplier?.sup_profilePicture || null;

        return {
          pub_id: pub.pub_id,
          pub_image: pub.pub_image,
          pub_description: pub.pub_description,
          pub_create: pub.pub_create,
          user: {
            ...userBase,
            usr_profilePicture
          }
        };
      });

      return {
        message: 'Publicaciones',
        statusCode: HttpStatus.OK,
        data: transformed,
      };
    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async deletePublication(id) {
    try {
      const publication = await this.publicationDao.getPublicationById(id)

      if (!publication) {
        throw new UnauthorizedException('Publicación no encontrado')
      }

      await this.publicationDao.deletePublication(id)

      return {
        message: 'Publicación eliminada',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async updatePublication(id, updatePublicationDto: UpdatePublicationDto) {
    try {
      const publication = await this.publicationDao.getPublicationById(id)


      if (!publication) {
        throw new UnauthorizedException('Publicación no encontrada')
      }

      await this.publicationDao.updatePublication(id, updatePublicationDto)

      const newPublication = await this.publicationDao.getPublicationById(id)

      return {
        message: 'Publicación actualizada',
        statusCode: HttpStatus.OK,
        data: newPublication
      };

    } catch (error) {
      // Si ya es una excepción de Nest, la volvemos a lanzar tal cual
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }
}
