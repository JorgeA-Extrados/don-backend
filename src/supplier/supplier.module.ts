import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierDao } from 'src/infrastructure/database/dao/supplier.dao';
import { User } from 'src/user/entities/user.entity';

@Module({
   imports:[TypeOrmModule.forFeature([Supplier, User])],
  controllers: [SupplierController],
  providers: [SupplierService, SupplierDao],
})
export class SupplierModule {}
