import { PartialType } from '@nestjs/mapped-types';
import { CreateServicesSearchDto } from './create-services-search.dto';

export class UpdateServicesSearchDto extends PartialType(CreateServicesSearchDto) {}
