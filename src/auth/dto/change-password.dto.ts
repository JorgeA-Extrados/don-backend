import { IsInt,  IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { passwordMaxLength, passwordMinLength } from "src/user/user.constants";


export class ChangePasswordDto {
   
    @IsString()
    @MinLength(passwordMinLength, {
      message: `Password is shorter than the minimum allowed length ${passwordMinLength}`,
    })
    @MaxLength(passwordMaxLength, {
      message: `Password is higher than the maximum allowed length ${passwordMaxLength}`,
    })
    @IsNotEmpty()
    newPassword: string;
      
    @IsString()
    @MinLength(passwordMinLength, {
      message: `Password is shorter than the minimum allowed length ${passwordMinLength}`,
    })
    @MaxLength(passwordMaxLength, {
      message: `Password is higher than the maximum allowed length ${passwordMaxLength}`,
    })
    @IsNotEmpty()
    newPasswordRepeat: string;

 }