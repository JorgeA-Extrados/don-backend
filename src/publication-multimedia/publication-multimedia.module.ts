import { Module } from '@nestjs/common';
import { PublicationMultimediaService } from './publication-multimedia.service';
import { PublicationMultimediaController } from './publication-multimedia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationMultimedia } from './entities/publication-multimedia.entity';
import { Publication } from 'src/publication/entities/publication.entity';
import { PublicationMultimediaDao } from 'src/infrastructure/database/dao/publication_multimedia.dao';

@Module({
  imports: [TypeOrmModule.forFeature([PublicationMultimedia, Publication])],
  controllers: [PublicationMultimediaController],
  providers: [PublicationMultimediaService, PublicationMultimediaDao],
})
export class PublicationMultimediaModule {}
