import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, ForgotPassword ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.jwt_secret'),
        signOptions: { expiresIn: configService.get('jwt.jwt_expires')}
      })
    })
  ],
  controllers: [AuthController, RefreshTokenController],
  providers: [AuthService, UserService, UserDao,  RefreshTokenService, JwtStrategy, ForgotPasswordDao, EmailRepository ],
})
export class AuthModule {}
