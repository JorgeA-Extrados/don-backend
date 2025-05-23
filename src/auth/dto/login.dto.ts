import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsOptional()
  usr_email?: string;

  @IsString()
  @IsOptional()
  usr_name?: string;

  @IsString()
  @IsNotEmpty()
  usr_password: string;

  @IsBoolean()
  @IsOptional()
  isSocialAuth?: boolean

}