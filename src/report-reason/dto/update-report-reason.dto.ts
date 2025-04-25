import { PartialType } from '@nestjs/mapped-types';
import { CreateReportReasonDto } from './create-report-reason.dto';

export class UpdateReportReasonDto extends PartialType(CreateReportReasonDto) {}
