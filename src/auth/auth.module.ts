import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenController } from './refresh-token.controller';
import { UserService } from 'src/user/user.service';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { RefreshTokenService } from './refresh-token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ForgotPassword } from './entities/forgot-password.entity';
import { ForgotPasswordDao } from 'src/infrastructure/database/dao/forgot_password.dao';
import { EmailRepository } from 'src/infrastructure/utils/email/email.repository';
import { CreditsDonDao } from 'src/infrastructure/database/dao/credits_don.dao';
import { CreditsDon } from 'src/credits-don/entities/credits-don.entity';
import { CreditsReason } from 'src/credits-reason/entities/credits-reason.entity';
import { ForgotPasswordAttempts } from './entities/forgot_password_attempts.entity';
import { UserVerificationAttempts } from './entities/user_verification_attempts.entity';
import { ForgotPasswordAttemptsDao } from 'src/infrastructure/database/dao/forgot_password_attempts.dao';
import { UserVerificationAttemptsDao } from 'src/infrastructure/database/dao/user_verification_attempts.dao';
import { SupplierDao } from 'src/infrastructure/database/dao/supplier.dao';
import { ServicesSearchDao } from 'src/infrastructure/database/dao/services_search.dao';
import { ProfessionalDao } from 'src/infrastructure/database/dao/professional.dao';
import { Professional } from 'src/professional/entities/professional.entity';
import { ServicesSearch } from 'src/services-search/entities/services-search.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { ExperienceDao } from 'src/infrastructure/database/dao/experiences.dao';
import { UserHeadingDao } from 'src/infrastructure/database/dao/userHeading.dao';
import { PublicationDao } from 'src/infrastructure/database/dao/publication.dao';
import { Experience } from 'src/experiences/entities/experience.entity';
import { UserHeading } from 'src/user-heading/entities/user-heading.entity';
import { Publication } from 'src/publication/entities/publication.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Heading } from 'src/heading/entities/heading.entity';
import { SubHeading } from 'src/sub-heading/entities/sub-heading.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, ForgotPassword, CreditsDon, CreditsReason, ForgotPasswordAttempts, UserVerificationAttempts, Professional, ServicesSearch, Supplier, Experience, UserHeading, Publication, Category, Heading, SubHeading ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.jwt_secret'),
        signOptions: { expiresIn: configService.get('jwt.jwt_expires')}
      })
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController, RefreshTokenController],
  providers: [AuthService, RefreshTokenService, JwtStrategy, ForgotPasswordDao, EmailRepository, CreditsDonDao, ForgotPasswordAttemptsDao, UserVerificationAttemptsDao, ProfessionalDao, ServicesSearchDao, SupplierDao, ExperienceDao, UserHeadingDao, PublicationDao, UserDao, UserService],
  exports: [AuthService, RefreshTokenService], 
  
})
export class AuthModule {}
