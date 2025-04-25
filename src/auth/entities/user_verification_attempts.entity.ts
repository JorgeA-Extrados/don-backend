import { IsBoolean, IsDateString, IsNumber } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('user_verification_attempts')
export class UserVerificationAttempts {
    @PrimaryGeneratedColumn({
        name: 'uva_id'
    })
    @IsNumber()
    uva_id: number;

    @Column({
        name: 'uva_created_at'
    })
    @IsDateString()
    uva_created_at: Date;

    @Column({
        name: 'uva_completed',
        default: false
    })
    @IsBoolean()
    uva_completed: boolean;

    @ManyToOne(() => User, user => user.verificationAttempts)
    @JoinColumn({ name: 'usr_id' })
    user: User;
}
