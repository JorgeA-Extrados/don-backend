import { IsBoolean, IsDateString, IsNumber } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('forgot_password_attempts')
export class ForgotPasswordAttempts {
    @PrimaryGeneratedColumn({
        name: 'fpa_id',
    })
    @IsNumber()
    fpa_id: number;

    @Column({
        name: 'fpa_created_at'
    })
    @IsDateString()
    fpa_created_at: Date;

    @Column({
        name: 'fpa_attempts',
        default: 1
    })
    @IsNumber()
    fpa_attempts: number;

    @Column({
        name: 'fpa_completed',
        default: false
    })
    @IsBoolean()
    fpa_completed: boolean;

    @ManyToOne(() => User, user => user.forgotPasswordAttempts)
    @JoinColumn({ name: 'usr_id' })
    user: User;
}
