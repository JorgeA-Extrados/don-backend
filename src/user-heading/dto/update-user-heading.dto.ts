import { PartialType } from '@nestjs/mapped-types';
import { CreateUserHeadingDto } from './create-user-heading.dto';

export class UpdateUserHeadingDto extends PartialType(CreateUserHeadingDto) {}
