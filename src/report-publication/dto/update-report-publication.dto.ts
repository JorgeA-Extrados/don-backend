import { PartialType } from '@nestjs/mapped-types';
import { CreateReportPublicationDto } from './create-report-publication.dto';

export class UpdateReportPublicationDto extends PartialType(CreateReportPublicationDto) {}
