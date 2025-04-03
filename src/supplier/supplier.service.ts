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

    return {
      message: 'Supplier',
      statusCode: HttpStatus.OK,
      data: supplier,
    };
  }

  async updateProfilePicture(sup_id: number, file: Express.Multer.File) {

    try {
      const supplier = await this.supplierDao.getSupplierById(sup_id);

      if (!supplier) throw new Error('Profesional no encontrado');

      const imageUrl = await this.firebaseService.uploadFile(file, sup_id);

      const updateImg = {
        sup_profilePicture: imageUrl
      }


      await this.supplierDao.updateSupplier(sup_id, updateImg)

      const newProfessional = await this.supplierDao.getSupplierById(sup_id)

      return {
        message: 'Supplier Image Update',
        statusCode: HttpStatus.OK,
        data: newProfessional
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async getSupplierById(id: number) {
    try {
      const supplier = await this.supplierDao.getSupplierById(id);

      if (!supplier) {
        throw new UnauthorizedException('Supplier not fount')
      }

      return {
        message: 'Supplier',
        statusCode: HttpStatus.OK,
        data: supplier,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async getAllSupplier() {
    try {
      const supplier = await this.supplierDao.getAllSupplier();

      if (supplier.length === 0) {
        throw new UnauthorizedException('Suppliers not fount')
      }

      return {
        message: 'Supplier',
        statusCode: HttpStatus.OK,
        data: supplier,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${error.code} ${error.detail} ${error.message}`,
        error: `Internal Error`,
      });
    }
  }

  async deleteSupplier(id) {
    const supplier = await this.supplierDao.getSupplierById(id)

    if (!supplier) {
      throw new UnauthorizedException('Supplier not fount')
    }

    await this.supplierDao.deleteSupplier(id)

    return {
      message: 'Supplier delete',
      statusCode: HttpStatus.OK,
    };
  }

  async updateSupplier(id, updateSupplierDto: UpdateSupplierDto) {
    try {
      const supplier = await this.supplierDao.getSupplierById(id)


      if (!supplier) {
        throw new UnauthorizedException('Supplier not fount')
      }


      await this.supplierDao.updateSupplier(id, updateSupplierDto)

      const newSupplier = await this.supplierDao.getSupplierById(id)

      return {
        message: 'Supplier Update',
        statusCode: HttpStatus.OK,
        data: newSupplier
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
