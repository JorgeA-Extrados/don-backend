import { Module } from '@nestjs/common';
import { HeadingService } from './heading.service';
import { HeadingController } from './heading.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Heading } from './entities/heading.entity';
import { SubHeading } from 'src/sub-heading/entities/sub-heading.entity';
import { HeadingDao } from 'src/infrastructure/database/dao/heading.dao';

@Module({
  imports:[TypeOrmModule.forFeature([Heading, SubHeading])],
  controllers: [HeadingController],
  providers: [HeadingService, HeadingDao],
})
export class HeadingModule {}
