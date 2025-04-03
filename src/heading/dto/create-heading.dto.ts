import { IsNotEmpty, IsString } from "class-validator";


export class CreateHeadingDto {

    @IsNotEmpty()
    @IsString()
    hea_name: string;


    @IsNotEmpty()
    @IsString()
    hea_icon: string;
}
