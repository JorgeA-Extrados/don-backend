import { PartialType } from '@nestjs/mapped-types';
import { CreateSubHeadingDto } from './create-sub-heading.dto';

export class UpdateSubHeadingDto extends PartialType(CreateSubHeadingDto) {}
