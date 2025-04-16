import { IsInt, IsNotEmpty, IsString } from "class-validator";


export class CreateReportPublicationDto {

    @IsNotEmpty()
    @IsString()
    rep_description: string;

    @IsNotEmpty()
    @IsInt()
    pub_id: number;

    @IsNotEmpty()
    @IsInt()
    usr_id: number;

    @IsNotEmpty()
    @IsInt()
    rea_id: number;
}
