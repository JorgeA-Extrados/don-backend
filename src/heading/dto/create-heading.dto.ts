import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateHeadingDto {

    @IsNotEmpty()
    @IsString()
    hea_name: string;

    @IsNotEmpty()
    @IsString()
    hea_icon: string;

    @IsOptional()
    @IsString()
    hea_type?: string;
}
