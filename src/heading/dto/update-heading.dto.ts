import { PartialType } from '@nestjs/mapped-types';
import { CreateHeadingDto } from './create-heading.dto';

export class UpdateHeadingDto extends PartialType(CreateHeadingDto) {}
