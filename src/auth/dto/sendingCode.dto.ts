import {  IsEmail,  IsNotEmpty,  IsString } from "class-validator";

export class SendingCodeDto {

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

 }
