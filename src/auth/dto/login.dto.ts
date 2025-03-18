import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  usr_email: string;

  @IsString()
  @IsOptional()
  usr_password?: string;

  @IsString()
  @IsOptional()
  usr_invitationCode?: string;

}