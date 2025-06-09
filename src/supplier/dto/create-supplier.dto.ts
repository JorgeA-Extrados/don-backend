import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateSupplierDto {

    @IsNotEmpty()
    @IsString()
    sup_firstName: string;

    @IsNotEmpty()
    @IsString()
    sup_lastName: string;

    @IsNotEmpty()
    @IsString()
    sup_latitude: string;

    @IsNotEmpty()
    @IsString()
    sup_longitude: string;

    @IsNotEmpty()
    @IsString()
    sup_address: string;

    @IsOptional()
    @IsString()
    sup_profilePicture?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160, { message: 'La descripción no puede superar los 160 caracteres.' })
    sup_description?: string;

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
