import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from './entities/publication.entity';
import { PublicationDao } from 'src/infrastructure/database/dao/publication.dao';
import { User } from 'src/user/entities/user.entity';
import { FirebaseService } from 'src/infrastructure/config/firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, User])],
  controllers: [PublicationController],
  providers: [PublicationService, PublicationDao, FirebaseService],
})
export class PublicationModule { }
