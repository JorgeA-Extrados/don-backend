import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCreditsDonDto {

    @IsNotEmpty()
    @IsNumber()
    cre_amount: number;

    @IsOptional()
    @IsBoolean()
    cre_isCredits?: boolean;

    @IsNotEmpty()
    @IsInt()
    usr_id: number;

    @IsNotEmpty()
    @IsInt()
    crs_id: number;
}
