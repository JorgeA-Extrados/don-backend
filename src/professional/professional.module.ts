import { Module } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity';
import { User } from 'src/user/entities/user.entity';
import { ProfessionalDao } from 'src/infrastructure/database/dao/professional.dao';
import { FirebaseService } from 'src/infrastructure/config/firebase.service';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { ForgotPassword } from 'src/auth/entities/forgot-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Professional, User, ForgotPassword])],
  controllers: [ProfessionalController],
  providers: [ProfessionalService, ProfessionalDao, FirebaseService, UserDao],
})
export class ProfessionalModule { }
