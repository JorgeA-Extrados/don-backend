import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { passwordMaxLength, passwordMinLength } from "../user.constants";


export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    usr_email: string;

    @IsOptional()
    @IsString()
    @MinLength(passwordMinLength, {
        message: `Password is shorter than the minimum allowed length ${passwordMinLength}`,
    })
    @MaxLength(passwordMaxLength, {
        message: `Password is higher than the maximum allowed length ${passwordMaxLength}`,
    })
    usr_password?: string;

    @IsOptional()
    @IsString()
    usr_invitationCode?: string;

    @IsOptional()
    @IsString()
    usr_firstName?: string;

    @IsOptional()
    @IsString()
    usr_lastName?: string;

    @IsOptional()
    @IsString()
    usr_address?: string;

    @IsNotEmpty()
    @IsString()
    usr_name: string;

    @IsOptional()
    @IsString()
    usr_role?: string;

    @IsOptional()
    @IsString()
    usr_profilePicture?: string;

    @IsOptional()
    @IsString()
    usr_phone?: string;

    @IsOptional()
    @IsString()
    usr_creditDON?: string;

    @IsOptional()
    @IsString()
    usr_active?: string;
}
