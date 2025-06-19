import { Module } from '@nestjs/common';
import { UserViewedAdminPublicationService } from './user_viewed_admin_publication.service';
import { UserViewedAdminPublicationController } from './user_viewed_admin_publication.controller';

@Module({
  controllers: [UserViewedAdminPublicationController],
  providers: [UserViewedAdminPublicationService],
})
export class UserViewedAdminPublicationModule {}
