import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { passwordMaxLength, passwordMinLength } from "../user.constants";


export class CreateDeletePhysicsDto {
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
}
