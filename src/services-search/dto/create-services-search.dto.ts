import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateServicesSearchDto {
    @IsNotEmpty()
    @IsString()
    sea_firstName: string;

    @IsNotEmpty()
    @IsString()
    sea_lastName: string;

    @IsNotEmpty()
    @IsString()
    sea_latitude: string;

    @IsNotEmpty()
    @IsString()
    sea_longitude: string;

    @IsOptional()
    @IsString()
    sea_profilePicture?: string;

    @IsString()
    @IsOptional()
    usr_name?: string;

    @IsNotEmpty()
    @IsInt()
    usr_id: number;

}
