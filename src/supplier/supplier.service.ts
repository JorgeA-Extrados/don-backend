import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierDao } from 'src/infrastructure/database/dao/supplier.dao';

@Injectable()
export class SupplierService {
    constructor(
      private readonly supplierDao: SupplierDao,
    ) { }


    async createSupplier(createSupplierDto: CreateSupplierDto) {
  
      const supplier = await this.supplierDao.createSupplier(createSupplierDto);
  
      return {
        message: 'Supplier',
        statusCode: HttpStatus.OK,
        data: supplier,
      };
    }
  
    async getSupplierById(id: number) {
      try {
        const supplier = await this.supplierDao.getSupplierById(id);
  
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
