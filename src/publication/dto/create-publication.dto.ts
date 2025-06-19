import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";


export class CreatePublicationDto {

    // @IsOptional()
    // @IsString()
    // pub_image?: string;

    @IsOptional()
    @IsString()
    @MaxLength(250, { message: 'La descripción no puede superar los 250 caracteres.' })
    pub_description?: string;

    @IsOptional()
    @IsString()
    pub_reason_for_deletion?: string;

    @IsOptional()
    @IsBoolean()
    pub_admin_publication?: boolean;

    @IsNotEmpty()
    @IsInt()
    usr_id: number
}
