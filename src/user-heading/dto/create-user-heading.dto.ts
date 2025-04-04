import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";


export class CreateUserHeadingDto {

    @IsNumber()
    @IsNotEmpty()
    usr_id: number;

    @IsNumber()
    @IsNotEmpty()
    hea_id: number;

    @IsNumber()
    @IsOptional()
    sbh_id?: number;
}
