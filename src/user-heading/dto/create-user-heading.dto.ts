import { IsNumber, IsNotEmpty, IsArray, ArrayMinSize, IsOptional } from 'class-validator';

export class CreateUserHeadingDto {
  @IsNumber()
  @IsNotEmpty()
  usr_id: number;

  @IsArray()
  @ArrayMinSize(1)
  hea_id: number[];

  @IsArray()
  @IsOptional()
  sbh_id?: number[]; // Puede ser más corto o contener null/undefined en posiciones
}

