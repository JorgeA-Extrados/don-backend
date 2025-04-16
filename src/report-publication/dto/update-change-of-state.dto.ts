import { PartialType } from '@nestjs/mapped-types';
import { CreateChangeOfStateDto } from './change-of-state.dto';

export class UpdateChangeOfStateDto extends PartialType(CreateChangeOfStateDto) {}