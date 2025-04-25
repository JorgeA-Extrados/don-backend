import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class SearchProfessionalDto {

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    hea_id?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    lat?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    lng?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    radius?: number; // en kilómetros
  }
  