import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierDao } from 'src/infrastructure/database/dao/supplier.dao';
import { FirebaseService } from 'src/infrastructure/config/firebase.service';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';

@Injectable()
export class SupplierService {
  constructor(
    private readonly supplierDao: SupplierDao,
    private readonly userDao: UserDao,
    private readonly firebaseService: FirebaseService,
  ) { }


  async createSupplier(createSupplierDto: CreateSupplierDto) {

    const supplier = await this.supplierDao.createSupplier(createSupplierDto);

    const { usr_name, usr_id } = createSupplierDto
    if (usr_name) {
      const update = {
        usr_name
      }
      await this.userDao.updateUser(usr_id, update)
    }

    const updateRole = {
      usr_role: "supplier"
    }
    await this.userDao.updateUser(usr_id, updateRole)

    return {
      message: 'Proveedor',
      statusCode: HttpStatus.OK,
      data: supplier,
    };
  }

  async updateProfilePicture(sup_id: number, file: Express.Multer.File) {

    try {
      const supplier = await this.supplierDao.getSupplierById(sup_id);

      if (!supplier) {
        return {
          message: 'Proveedor no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      const imageUrl = await this.firebaseService.uploadFile(file, sup_id);

      const updateImg = {
        sup_profilePicture: imageUrl
      }


      await this.supplierDao.updateSupplier(sup_id, updateImg)

      const newProfessional = await this.supplierDao.getSupplierById(sup_id)

      return {
        message: 'Imagen del proveedor actualizada con éxito',
        statusCode: HttpStatus.OK,
        data: newProfessional
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getSupplierById(id: number) {
    try {
      const supplier = await this.supplierDao.getSupplierById(id);

      if (!supplier) {
        return {
          message: 'Proveedor no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Proveedor',
        statusCode: HttpStatus.OK,
        data: supplier,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async getAllSupplier() {
    try {
      const supplier = await this.supplierDao.getAllSupplier();

      if (supplier.length === 0) {
        return {
          message: 'Proveedor no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      return {
        message: 'Proveedor',
        statusCode: HttpStatus.OK,
        data: supplier,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Error interno`,
      });
    }
  }

  async deleteSupplier(id) {
    try {
      const supplier = await this.supplierDao.getSupplierById(id)

      if (!supplier) {
        return {
          message: 'Proveedor no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }

      await this.supplierDao.deleteSupplier(id)

      return {
        message: 'Proveedor eliminado',
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

  async updateSupplier(id, updateSupplierDto: UpdateSupplierDto) {
    try {
      const supplier = await this.supplierDao.getSupplierById(id)


      if (!supplier) {
        return {
          message: 'Proveedor no encontrado',
          statusCode: HttpStatus.NO_CONTENT,
        };
      }


      await this.supplierDao.updateSupplier(id, updateSupplierDto)

      const newSupplier = await this.supplierDao.getSupplierById(id)

      return {
        message: 'Proveedor actualizado',
        statusCode: HttpStatus.OK,
        data: newSupplier
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
