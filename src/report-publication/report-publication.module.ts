import { Module } from '@nestjs/common';
import { ReportPublicationService } from './report-publication.service';
import { ReportPublicationController } from './report-publication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportPublication } from './entities/report-publication.entity';
import { Publication } from 'src/publication/entities/publication.entity';
import { User } from 'src/user/entities/user.entity';
import { ReportPublicationDao } from 'src/infrastructure/database/dao/reportPublication.dao';
import { ReportReason } from 'src/report-reason/entities/report-reason.entity';
import { PublicationDao } from 'src/infrastructure/database/dao/publication.dao';
import { EmailRepository } from 'src/infrastructure/utils/email/email.repository';
import { PublicationMultimedia } from 'src/publication-multimedia/entities/publication-multimedia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportPublication, Publication, User, ReportReason, PublicationMultimedia])],
  controllers: [ReportPublicationController],
  providers: [ReportPublicationService, ReportPublicationDao, PublicationDao, EmailRepository],
})
export class ReportPublicationModule {}
