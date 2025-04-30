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
        return {
          message: 'Publicación no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
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
        return {
          message: 'Publicación no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
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
        return {
          message: 'No hay publicaciones disponibles',
          statusCode: HttpStatus.NO_CONTENT,
        };
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
        return {
          message: 'Publicación no encontrada',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.publicationDao.deletePublication(id)

      return {
        message: 'Publicación eliminada',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
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
        return {
          message: 'Publicación no encontradas',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.publicationDao.updatePublication(id, updatePublicationDto)

      const newPublication = await this.publicationDao.getPublicationById(id)

      return {
        message: 'Publicación actualizada',
        statusCode: HttpStatus.OK,
        data: newPublication
      };

    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }


  async getPublicationByUserId(id: number) {
    try {
      const publications = await this.publicationDao.getPublicationByUserId(id);
  
      if (!publications || publications.length === 0) {
        return {
          message: 'El usuario no tiene ninguna publicación',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }
  
      // Primero, filtramos y mapeamos
      const publicacionesFiltradas = publications
        .filter(pub => {
          if (pub.pub_delete !== null && pub.pub_reason_for_deletion === null) {
            return false;
          }
          return true;
        })
        .map(pub => {
          if (pub.pub_delete !== null && pub.pub_reason_for_deletion !== null) {
            return {
              pub_id: pub.pub_id,
              pub_reason_for_deletion: pub.pub_reason_for_deletion,
              pub_create: pub.pub_create,
            };
          }
          return pub;
        });
  
      // Luego, transformamos solo si es una publicación completa
      const transformed = publicacionesFiltradas.map((publication) => {
        // Si la publicación no tiene propiedad "user", la devolvemos tal cual (es reducida)
        if (!('user' in publication)) {
          return publication;
        }
  
        const { user } = publication;
  
        const usr_profilePicture =
          user?.professional?.pro_profilePicture ??
          user?.supplier?.sup_profilePicture ??
          null;
  
        return {
          ...publication,
          user: {
            usr_id: user.usr_id,
            usr_email: user.usr_email,
            usr_invitationCode: user.usr_invitationCode,
            usr_name: user.usr_name,
            usr_role: user.usr_role,
            usr_phone: user.usr_phone,
            usr_profilePicture,
          },
        };
      });
  
      return {
        message: 'Todas las publicaciones del usuario',
        statusCode: HttpStatus.OK,
        data: transformed,
      };
  
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
  
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code || ''} ${error.detail || ''} ${error.message || 'Error desconocido'}`,
        error: `Error interno`,
      });
    }
  }
  
}
