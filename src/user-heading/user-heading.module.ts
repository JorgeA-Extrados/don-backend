import { Module } from '@nestjs/common';
import { UserHeadingService } from './user-heading.service';
import { UserHeadingController } from './user-heading.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserHeading } from './entities/user-heading.entity';
import { Heading } from 'src/heading/entities/heading.entity';
import { UserHeadingDao } from 'src/infrastructure/database/dao/userHeading.dao';
import { SubHeading } from 'src/sub-heading/entities/sub-heading.entity';
import { SubHeadingDao } from 'src/infrastructure/database/dao/subHeading.dao';

@Module({
   imports:[TypeOrmModule.forFeature([User, UserHeading, Heading, SubHeading])],
  controllers: [UserHeadingController],
  providers: [UserHeadingService, UserHeadingDao, SubHeadingDao],
})
export class UserHeadingModule {}
