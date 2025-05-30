import { IsOptional, IsString } from "class-validator";
import { passwordMaxLength, passwordMinLength } from "../user.constants";


export class CreateAllUserDto {

    // @IsOptional()
    // @IsString()
    // usr_name?: string;

    @IsOptional()
    @IsString()
    usr_firstName?: string;

    @IsOptional()
    @IsString()
    usr_lastName?: string;

    @IsOptional()
    @IsString()
    usr_latitude?: string;

    @IsOptional()
    @IsString()
    usr_longitude?: string;

    @IsOptional()
    @IsString()
    usr_address?: string;

    @IsOptional()
    @IsString()
    usr_phone?: string;

    @IsOptional()
    @IsString()
    usr_description?: string;
}
