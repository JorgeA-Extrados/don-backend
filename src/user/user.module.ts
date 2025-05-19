import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RefreshTokenService } from 'src/auth/refresh-token.service';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import { ForgotPassword } from 'src/auth/entities/forgot-password.entity';
import { EmailRepository } from 'src/infrastructure/utils/email/email.repository';
import { CreditsDonDao } from 'src/infrastructure/database/dao/credits_don.dao';
import { CreditsDon } from 'src/credits-don/entities/credits-don.entity';
import { CreditsReason } from 'src/credits-reason/entities/credits-reason.entity';
import { UserVerificationAttemptsDao } from 'src/infrastructure/database/dao/user_verification_attempts.dao';
import { UserVerificationAttempts } from 'src/auth/entities/user_verification_attempts.entity';
import { ProfessionalDao } from 'src/infrastructure/database/dao/professional.dao';
import { ServicesSearchDao } from 'src/infrastructure/database/dao/services_search.dao';
import { SupplierDao } from 'src/infrastructure/database/dao/supplier.dao';
import { Professional } from 'src/professional/entities/professional.entity';
import { ServicesSearch } from 'src/services-search/entities/services-search.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { AuthService } from 'src/auth/auth.service';
import { ForgotPasswordDao } from 'src/infrastructure/database/dao/forgot_password.dao';
import { ForgotPasswordAttemptsDao } from 'src/infrastructure/database/dao/forgot_password_attempts.dao';
import { ForgotPasswordAttempts } from 'src/auth/entities/forgot_password_attempts.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, RefreshToken, ForgotPassword, CreditsDon, CreditsReason, UserVerificationAttempts, Professional, ServicesSearch, Supplier, ForgotPasswordAttempts])],
  controllers: [UserController],
  providers: [UserService, UserDao, RefreshTokenService, JwtService, EmailRepository, CreditsDonDao, UserVerificationAttemptsDao, ProfessionalDao, ServicesSearchDao, SupplierDao, AuthService, ForgotPasswordDao, ForgotPasswordAttemptsDao],
})
export class UserModule {}
