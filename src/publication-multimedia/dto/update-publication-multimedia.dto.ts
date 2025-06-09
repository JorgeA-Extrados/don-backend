import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicationMultimediaDto } from './create-publication-multimedia.dto';

export class UpdatePublicationMultimediaDto extends PartialType(CreatePublicationMultimediaDto) {}
