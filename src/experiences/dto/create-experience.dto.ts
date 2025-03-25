import { IsInt, IsNotEmpty, IsString } from "class-validator";


export class CreateExperienceDto {

    @IsNotEmpty()
    @IsString()
    exp_documentation: string;


    @IsNotEmpty()
    @IsString()
    exp_note: string;


    @IsNotEmpty()
    @IsString()
    exp_image: string;

    @IsNotEmpty()
    @IsInt()
    usr_id: number;
}
