import { IsNotEmpty, IsString } from "class-validator";


export class CreateCategoryDto {
        @IsNotEmpty()
        @IsString()
        cat_category: string;
}
