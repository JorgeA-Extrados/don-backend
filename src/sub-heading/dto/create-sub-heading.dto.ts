import { IsInt, IsNotEmpty, IsString } from "class-validator";


export class CreateSubHeadingDto {

    @IsNotEmpty()
    @IsString()
    sbh_name: string;

    @IsNotEmpty()
    @IsString()
    sbh_icon: string;

    @IsNotEmpty()
    @IsInt()
    hea_id: number;
}
