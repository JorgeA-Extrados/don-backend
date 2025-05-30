import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateServicesSearchDto {
    @IsNotEmpty()
    @IsString()
    sea_firstName: string;

    @IsNotEmpty()
    @IsString()
    sea_lastName: string;

    @IsNotEmpty()
    @IsString()
    sea_latitude: string;

    @IsNotEmpty()
    @IsString()
    sea_longitude: string;

    @IsNotEmpty()
    @IsString()
    sea_address: string;

    @IsOptional()
    @IsString()
    sea_profilePicture?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160, { message: 'La descripción no puede superar los 160 caracteres.' })
    sea_description?: string;

    @IsString()
    @IsOptional()
    usr_name?: string;
    
    @IsOptional()
    @IsString()
    usr_phone?: string;

    @IsNotEmpty()
    @IsInt()
    usr_id: number;

}
