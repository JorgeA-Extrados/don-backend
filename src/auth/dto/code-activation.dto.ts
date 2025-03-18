import { IsInt,  IsNotEmpty } from "class-validator";

export class CodeActivationDto {
   
    @IsInt()
    @IsNotEmpty()
    code: number;
 }