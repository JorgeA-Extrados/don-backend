import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserHeadingDto } from './dto/create-user-heading.dto';
import { UpdateUserHeadingDto } from './dto/update-user-heading.dto';
import { UserHeadingDao } from 'src/infrastructure/database/dao/userHeading.dao';
import { SubHeadingDao } from 'src/infrastructure/database/dao/subHeading.dao';

@Injectable()
export class UserHeadingService {

  constructor(
    private readonly userHeadingDao: UserHeadingDao,
    private readonly subHeadingDao: SubHeadingDao,
  ) { }

  async createUserHeading(createUserHeadingDto: CreateUserHeadingDto) {
    try {
      const { usr_id, hea_id, sbh_id = [] } = createUserHeadingDto;

      if (!hea_id || hea_id.length === 0) {
        throw new BadRequestException('Debe incluir al menos un rubro');
      }

      const existingAll = await this.userHeadingDao.getUserHeadingByUserId(usr_id);
      const existingHeaIds = new Set(existingAll.map(e => e.heading.hea_id));

      const nuevosHeaIds = hea_id.filter(id => !existingHeaIds.has(id));
      const totalHeaIds = new Set([...existingHeaIds, ...nuevosHeaIds]);

      if (totalHeaIds.size > 3) {
        throw new BadRequestException('Solo se pueden asignar hasta 3 rubros por usuario');
      }

      const createdUserHeadings: any[] = [];
      const usedSubIds: number[] = [];

      for (const currentHeaId of hea_id) {
        const existing = existingAll.filter(e => e.heading.hea_id === currentHeaId);

        let subrubrosAsociados = false;

        for (const subId of sbh_id) {
          if (usedSubIds.includes(subId)) continue;

          const subHeading = await this.subHeadingDao.getSubHeadingById(subId);
          if (!subHeading || subHeading.heading.hea_id !== currentHeaId) continue;

          usedSubIds.push(subId);
          subrubrosAsociados = true;

          const yaExisteExacto = existing.find(
            e => e.subHeading?.sbh_id === subId
          );
          if (yaExisteExacto) continue; // ya está asignado igual

          // Actualizamos si hay uno sin subHeading
          const existenteConOtro = existing.find(e => !e.subHeading);
          if (existenteConOtro) {
            await this.userHeadingDao.updateUserHeadingCreate(existenteConOtro.ush_id, { sbh_id: subId });
            createdUserHeadings.push({ ...existenteConOtro, sbh_id: subId });
          } else {
            const nuevo = await this.userHeadingDao.createUserHeading({
              usr_id,
              hea_id: currentHeaId,
              sbh_id: subId,
            });
            createdUserHeadings.push(nuevo);
          }
        }

        // Si no se asociaron subrubros, creamos solo si NO existe ya esa combinación con sbh_id: null
        if (!subrubrosAsociados) {
          const yaExisteSinSub = existing.find(e => !e.subHeading);
          if (!yaExisteSinSub) {
            const nuevo = await this.userHeadingDao.createUserHeading({
              usr_id,
              hea_id: currentHeaId,
              sbh_id: null,
            });
            createdUserHeadings.push(nuevo);
          }
        }
      }

      const unusedSubIds = sbh_id.filter((id) => !usedSubIds.includes(id));
      if (unusedSubIds.length > 0) {
        throw new BadRequestException(
          `Los sub-rubros ${unusedSubIds.join(', ')} no pudieron asignarse a un rubro, verifique que sean correctos`
        );
      }

      return {
        message: 'Usuario-rubro creados/actualizados correctamente',
        statusCode: HttpStatus.OK,
        data: createdUserHeadings,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.message}`,
        error: 'Error interno',
      });
    }
  }

  async getUserHeadingById(id: number) {
    try {
      const userHeading = await this.userHeadingDao.getUserHeadingById(id);

      if (!userHeading) {
        return {
          message: 'Usuario-rubro no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Usuario-rubro',
        statusCode: HttpStatus.OK,
        data: userHeading,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getUserHeadingByUserId(id: number) {
    try {
      const userHeading = await this.userHeadingDao.getUserHeadingByUserId(id);

      if (userHeading.length === 0) {
        return {
          message: 'Usuario-rubro no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Usuario-rubro',
        statusCode: HttpStatus.OK,
        data: userHeading,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllUserHeading() {
    try {
      const userHeading = await this.userHeadingDao.getAllUserHeading();

      if (userHeading.length === 0) {
        return {
          message: 'Usuario-rubro no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Usuario-rubro',
        statusCode: HttpStatus.OK,
        data: userHeading,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async deleteUserHeading(id) {
    try {
      const userHeading = await this.userHeadingDao.getUserHeadingById(id)

      if (!userHeading) {
        return {
          message: 'Usuario-rubro no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.userHeadingDao.deleteUserHeading(id)

      return {
        message: 'Usuario-rubro eliminado',
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

  async updateUserHeading(id, updateUserHeadingDto: UpdateUserHeadingDto) {
    try {
      const userHeading = await this.userHeadingDao.getUserHeadingById(id)


      if (!userHeading) {
        return {
          message: 'Usuario-rubro no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }


      await this.userHeadingDao.updateUserHeading(id, updateUserHeadingDto)

      const newUserHeading = await this.userHeadingDao.getUserHeadingById(id)

      return {
        message: 'Usuario-rubro actualizado',
        statusCode: HttpStatus.OK,
        data: newUserHeading
      };

    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }
}
