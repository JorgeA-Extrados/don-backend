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

  async updateUserHeading(updateUserHeadingDto: UpdateUserHeadingDto) {
    try {
      // const userHeading = await this.userHeadingDao.getUserHeadingById(id)


      // if (!userHeading) {
      //   return {
      //     message: 'Usuario-rubro no encontrado',
      //     statusCode: HttpStatus.NO_CONTENT,
      //   };
      // }


      // await this.userHeadingDao.updateUserHeading(id, updateUserHeadingDto)

      // const newUserHeading = await this.userHeadingDao.getUserHeadingById(id)

      // return {
      //   message: 'Usuario-rubro actualizado',
      //   statusCode: HttpStatus.OK,
      //   data: newUserHeading
      // };

      const { usr_id, hea_id, sbh_id = [] } = updateUserHeadingDto;

      if (!hea_id || hea_id.length === 0) {
        throw new BadRequestException('Debe incluir al menos un rubro');
      }

      // Validamos que no supere los 3 rubros
      if (hea_id.length > 3) {
        throw new BadRequestException('Solo se pueden asignar hasta 3 rubros por usuario');
      }

      if (usr_id) {
        const existentes = await this.userHeadingDao.getUserHeadingByUserId(usr_id);
        const nuevosUserHeadings: any[] = [];
        const usadosSubIds: number[] = [];

        const nuevasCombinaciones: { hea_id: number; sbh_id: number | null }[] = [];

        // Armamos las combinaciones nuevas
        for (const hea of hea_id) {
          let subAsociado = false;

          for (const sub of sbh_id) {
            const subHeading = await this.subHeadingDao.getSubHeadingById(sub);
            if (!subHeading || subHeading.heading.hea_id !== hea) continue;

            nuevasCombinaciones.push({ hea_id: hea, sbh_id: sub });
            usadosSubIds.push(sub);
            subAsociado = true;
          }

          if (!subAsociado) {
            nuevasCombinaciones.push({ hea_id: hea, sbh_id: null });
          }
        }

        // Eliminamos relaciones antiguas que ya no están
        const combinacionesExistentes = existentes.map(e => ({
          hea_id: e.heading.hea_id,
          sbh_id: e.subHeading?.sbh_id || null,
          ush_id: e.ush_id,
        }));

        const combinacionKey = (obj: { hea_id: number, sbh_id: number | null }) => `${obj.hea_id}-${obj.sbh_id ?? 'null'}`;

        const nuevasKeys = nuevasCombinaciones.map(combinacionKey);
        const existentesKeys = combinacionesExistentes.map(combinacionKey);

        const aEliminar = combinacionesExistentes.filter(e => !nuevasKeys.includes(combinacionKey(e)));
        const aMantener = combinacionesExistentes.filter(e => nuevasKeys.includes(combinacionKey(e)));
        const aCrear = nuevasCombinaciones.filter(n => !existentesKeys.includes(combinacionKey(n)));

        for (const old of aEliminar) {
          await this.deleteUserHeading(old.ush_id);
        }

        for (const nuevo of aCrear) {
          const creado = await this.userHeadingDao.createUserHeading({
            usr_id,
            hea_id: nuevo.hea_id,
            sbh_id: nuevo.sbh_id,
          });
          nuevosUserHeadings.push(creado);
        }

        const sbhUsados = new Set(usadosSubIds);
        const sbhSinUsar = sbh_id.filter(id => !sbhUsados.has(id));

        if (sbhSinUsar.length > 0) {
          throw new BadRequestException(
            `Los sub-rubros ${sbhSinUsar.join(', ')} no pudieron asociarse correctamente`
          );
        }

        const mantenidosCompletos = await Promise.all(
          aMantener.map(async (m) => {
            const encontrado = existentes.find(e => e.ush_id === m.ush_id);
            return encontrado;
          })
        );

        const finalData = [...nuevosUserHeadings, ...mantenidosCompletos].map((item) => ({
          ush_id: item.ush_id,
          ush_create: item.ush_create,
          ush_update: item.ush_update,
          ush_delete: item.ush_delete,
          user: {
            usr_id: item.user?.usr_id,
          },
          heading: {
            hea_id: item.heading?.hea_id,
          },
          subHeading: item.subHeading
            ? {
              sbh_id: item.subHeading.sbh_id,
            }
            : null,
        }));

        return {
          message: 'Usuario-rubro editados correctamente',
          statusCode: HttpStatus.OK,
          data: finalData,
        };
      }

    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }
}
