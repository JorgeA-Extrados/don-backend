import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierDao } from 'src/infrastructure/database/dao/supplier.dao';
import { User } from 'src/user/entities/user.entity';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { FirebaseService } from 'src/infrastructure/config/firebase.service';
import { ForgotPassword } from 'src/auth/entities/forgot-password.entity';

@Module({
   imports:[TypeOrmModule.forFeature([Supplier, User, ForgotPassword])],
  controllers: [SupplierController],
  providers: [SupplierService, SupplierDao, FirebaseService, UserDao],
})
export class SupplierModule {}
