import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreatePublicationDto {

    @IsOptional()
    @IsString()
    pub_image?: string;

    @IsOptional()
    @IsString()
    pub_description?: string;

    @IsOptional()
    @IsString()
    pub_reason_for_deletion?: string;

    @IsNotEmpty()
    @IsInt()
    usr_id: number
}
