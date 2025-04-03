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

@Module({
  imports:[TypeOrmModule.forFeature([User, RefreshToken, ForgotPassword])],
  controllers: [UserController],
  providers: [UserService, UserDao, RefreshTokenService, JwtService],
})
export class UserModule {}
