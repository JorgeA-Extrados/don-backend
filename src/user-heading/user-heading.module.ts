import { Module } from '@nestjs/common';
import { UserHeadingService } from './user-heading.service';
import { UserHeadingController } from './user-heading.controller';

@Module({
  controllers: [UserHeadingController],
  providers: [UserHeadingService],
})
export class UserHeadingModule {}
