import { IsNotEmpty, IsString } from "class-validator";


export class CreateReportReasonDto {

    @IsNotEmpty()
    @IsString()
    rea_reason: string;
}
