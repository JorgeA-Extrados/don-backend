import { IsInt, IsNotEmpty, IsString } from "class-validator";


export class CreatePublicationMultimediaDto {

    @IsNotEmpty()
    @IsString()
    pmt_file: string;

    @IsNotEmpty()
    @IsString()
    pmt_type: string;

    @IsNotEmpty()
    @IsInt()
    pub_id: number
}
