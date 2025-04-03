import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { User } from "src/user/entities/user.entity";

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('forgot_password')
export class ForgotPassword {

    @PrimaryGeneratedColumn({
        name: 'fop_id'
    })
    @IsNumber()
    fop_id: number;

    @Column({
        name: 'fop_date_expiry',
        nullable: false,
    })
    @IsDateString()
    @IsNotEmpty()
    fop_date_expiry: Date;

    @Column({
        name: 'fop_code_used',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    fop_code_used?: Date;

    @Column({
        name: 'fop_change_time',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    fop_change_time?: Date;

    @Column({
        name: 'fop_is_active',
        nullable: true,
    })
    @IsOptional()
    @IsBoolean()
    fop_is_active?: boolean;

    @Column({
        name: 'fop_code',
        nullable: false,
    })
    @IsNumber()
    @IsNotEmpty()
    fop_code: number;

    @ManyToOne(() => User, user => user.fop_id)
    @JoinColumn({ name: 'usr_id' })
    usrID: User;

}
