import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { CreditsReason } from "src/credits-reason/entities/credits-reason.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('credits_don')
export class CreditsDon {

    @PrimaryGeneratedColumn({
        name: 'cre_id',
    })
    @IsNumber()
    cre_id: number;


    @Column({
        name: 'cre_amount'
    })
    @IsNotEmpty()
    @IsNumber()
    cre_amount: number;

    @Column({
        name: 'cre_isCredits',
        default: false
    })
    @IsOptional()
    @IsBoolean()
    cre_isCredits?: boolean;

    @Column({
        name: 'cre_isAdmin',
        default: false
    })
    @IsOptional()
    @IsBoolean()
    cre_isAdmin?: boolean;

    @Column({
        name: 'cre_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    cre_create?: Date;

    @Column({
        name: 'cre_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    cre_update?: Date;

    @Column({
        name: 'cre_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    cre_delete?: Date;

    @ManyToOne(() => CreditsReason, creditsReason => creditsReason.creditsDon)
    @JoinColumn({ name: 'crs_id' })
    creditsReason: CreditsReason;

    @ManyToOne(() => User, user => user.creditsDon)
    @JoinColumn({ name: 'usr_id' })
    assigningUser: User;
}
