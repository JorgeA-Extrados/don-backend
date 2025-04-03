import { Module } from '@nestjs/common';
import { ServicesSearchService } from './services-search.service';
import { ServicesSearchController } from './services-search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesSearch } from './entities/services-search.entity';
import { ServicesSearchDao } from 'src/infrastructure/database/dao/services_search.dao';
import { User } from 'src/user/entities/user.entity';
import { ForgotPassword } from 'src/auth/entities/forgot-password.entity';
import { UserDao } from 'src/infrastructure/database/dao/user.dao';
import { FirebaseService } from 'src/infrastructure/config/firebase.service';

@Module({
   imports:[TypeOrmModule.forFeature([ServicesSearch, User, ForgotPassword])],
  controllers: [ServicesSearchController],
  providers: [ServicesSearchService, ServicesSearchDao, FirebaseService, UserDao],
})
export class ServicesSearchModule {}
