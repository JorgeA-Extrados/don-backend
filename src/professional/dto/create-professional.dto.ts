import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

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


    // file: any; // No se valida con class-validator

    @IsOptional()
    @IsString()
    pro_profilePicture?: string;

    @IsString()
    @IsOptional()
    usr_name?: string;

    @IsNotEmpty()
    @IsInt()
    usr_id: number;
}
