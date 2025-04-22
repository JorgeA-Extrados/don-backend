import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditsReasonDto } from './create-credits-reason.dto';

export class UpdateCreditsReasonDto extends PartialType(CreateCreditsReasonDto) {}
