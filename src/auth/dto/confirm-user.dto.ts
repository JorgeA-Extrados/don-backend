import {  IsNotEmpty, IsNumber } from "class-validator";

export class ConfirmUserDto {

    @IsNotEmpty()
    @IsNumber()
    code: number;

    @IsNotEmpty()
    @IsNumber()
    id: number;

}
