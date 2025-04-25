import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreditsDon } from "src/credits-don/entities/credits-don.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('credits_reason')
export class CreditsReason {

    @PrimaryGeneratedColumn({
        name: 'crs_id',
    })
    @IsNumber()
    crs_id: number;


    @Column({
        name: 'crs_reason'
    })
    @IsNotEmpty()
    @IsString()
    crs_reason: string;

    @Column({
        name: 'crs_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    crs_create?: Date;

    @Column({
        name: 'crs_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    crs_update?: Date;

    @Column({
        name: 'crs_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    crs_delete?: Date;

    @OneToMany(() => CreditsDon, creditsDon => creditsDon.creditsReason)
    creditsDon: CreditsDon;
}
