import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSupplierDto {

    @IsNotEmpty()
    @IsString()
    sup_firstName: string;

    @IsNotEmpty()
    @IsString()
    sup_lastName: string;

    @IsNotEmpty()
    @IsString()
    sup_latitude: string;

    @IsNotEmpty()
    @IsString()
    sup_longitude: string;

    @IsNotEmpty()
    @IsString()
    sup_profilePicture: string;

    @IsString()
    @IsOptional()
    usr_name?: string;

    @IsNotEmpty()
    @IsInt()
    usr_id: number;
}
