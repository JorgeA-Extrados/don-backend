import { Module } from '@nestjs/common';
import { ServicesSearchService } from './services-search.service';
import { ServicesSearchController } from './services-search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesSearch } from './entities/services-search.entity';
import { ServicesSearchDao } from 'src/infrastructure/database/dao/services_search.dao';
import { User } from 'src/user/entities/user.entity';

@Module({
   imports:[TypeOrmModule.forFeature([ServicesSearch, User])],
  controllers: [ServicesSearchController],
  providers: [ServicesSearchService, ServicesSearchDao],
})
export class ServicesSearchModule {}
