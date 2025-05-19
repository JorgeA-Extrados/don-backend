import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { passwordMaxLength, passwordMinLength } from "../user.constants";


export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    usr_email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(passwordMinLength, {
        message: `Password is shorter than the minimum allowed length ${passwordMinLength}`,
    })
    @MaxLength(passwordMaxLength, {
        message: `Password is higher than the maximum allowed length ${passwordMaxLength}`,
    })
    usr_password: string;

    @IsOptional()
    @IsString()
    @MinLength(passwordMinLength, {
        message: `Password is shorter than the minimum allowed length ${passwordMinLength}`,
    })
    @MaxLength(passwordMaxLength, {
        message: `Password is higher than the maximum allowed length ${passwordMaxLength}`,
    })
    usr_passwordConfir?: string;

    @IsOptional()
    @IsString()
    usr_invitationCode?: string;

    @IsOptional()
    @IsString()
    usr_user_code?: string;

    @IsOptional()
    @IsString()
    usr_name?: string;

    @IsOptional()
    @IsString()
    usr_phone?: string;

    @IsBoolean()
    usr_terms: boolean;

    @IsBoolean()
    usr_over: boolean;

    @IsBoolean()
    @IsOptional()
    isSocialAuth?: boolean
}
