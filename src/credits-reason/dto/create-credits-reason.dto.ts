import { IsNotEmpty, IsString } from "class-validator";

export class CreateCreditsReasonDto {
        @IsNotEmpty()
        @IsString()
        crs_reason: string;
}
