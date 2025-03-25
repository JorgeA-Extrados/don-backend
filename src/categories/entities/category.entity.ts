import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Experience } from "src/experiences/entities/experience.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('category')
export class Category {

    @PrimaryGeneratedColumn({
        name: 'cat_id',
    })
    @IsNumber()
    cat_id: number;

    @Column({
        name: 'cat_category',
    })
    @IsNotEmpty()
    @IsString()
    cat_category: string;

    @Column({
        name: 'cat_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    cat_create?: Date;

    @Column({
        name: 'cat_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    cat_update?: Date;

    @Column({
        name: 'cat_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    cat_delete?: Date;

    @OneToMany(() => Experience, experience => experience.cat_id)
    categoryExperience: Experience;
}
