import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditsDonDto } from './create-credits-don.dto';

export class UpdateCreditsDonDto extends PartialType(CreateCreditsDonDto) {}
