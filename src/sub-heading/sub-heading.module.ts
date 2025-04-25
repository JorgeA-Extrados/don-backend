import { Module } from '@nestjs/common';
import { SubHeadingService } from './sub-heading.service';
import { SubHeadingController } from './sub-heading.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Heading } from 'src/heading/entities/heading.entity';
import { SubHeading } from './entities/sub-heading.entity';
import { SubHeadingDao } from 'src/infrastructure/database/dao/subHeading.dao';

@Module({
  imports:[TypeOrmModule.forFeature([Heading, SubHeading])],
  controllers: [SubHeadingController],
  providers: [SubHeadingService, SubHeadingDao],
})
export class SubHeadingModule {}
