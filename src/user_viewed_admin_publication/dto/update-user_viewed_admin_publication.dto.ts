import { PartialType } from '@nestjs/mapped-types';
import { CreateUserViewedAdminPublicationDto } from './create-user_viewed_admin_publication.dto';

export class UpdateUserViewedAdminPublicationDto extends PartialType(CreateUserViewedAdminPublicationDto) {}
