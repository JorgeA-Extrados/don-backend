import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateChangeOfStateDto {

    @IsNotEmpty()
    @IsInt()
    pub_id: number;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsInt()
    rea_id: number;

    @IsOptional()
    @IsString()
    reason?: string;
}
