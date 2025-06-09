import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from './entities/publication.entity';
import { PublicationDao } from 'src/infrastructure/database/dao/publication.dao';
import { User } from 'src/user/entities/user.entity';
import { FirebaseService } from 'src/infrastructure/config/firebase.service';
import { PublicationMultimediaDao } from 'src/infrastructure/database/dao/publication_multimedia.dao';
import { PublicationMultimedia } from 'src/publication-multimedia/entities/publication-multimedia.entity';
import { ReportPublicationDao } from 'src/infrastructure/database/dao/reportPublication.dao';
import { ReportPublication } from 'src/report-publication/entities/report-publication.entity';
import { ReportReason } from 'src/report-reason/entities/report-reason.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, User, PublicationMultimedia, ReportPublication, ReportReason])],
  controllers: [PublicationController],
  providers: [PublicationService, PublicationDao, FirebaseService, PublicationMultimediaDao, ReportPublicationDao],
})
export class PublicationModule { }
