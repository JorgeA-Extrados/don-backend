import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProfessionalDto {
    @IsNotEmpty()
    @IsString()
    pro_firstName: string;

    @IsNotEmpty()
    @IsString()
    pro_lastName: string;

    @IsNotEmpty()
    @IsString()
    pro_latitude: string;

    @IsNotEmpty()
    @IsString()
    pro_longitude: string;

    @IsNotEmpty()
    @IsString()
    pro_address: string;

    @IsOptional()
    @IsString()
    pro_profilePicture?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160, { message: 'La descripción no puede superar los 160 caracteres.' })
    pro_description?: string;

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
