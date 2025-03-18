// refresh-token.entity.ts
import { IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('refresh_token')
export class RefreshToken {
    @PrimaryGeneratedColumn({
        name: 'rft_id'
    })
    @IsNumber()
    id: number;

    @Column({
        name: 'rft_token'
    })
    @IsString()
    rft_token: string;

    @OneToOne(() => User, user => user.refreshToken, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usr_id' })
    user: User;
}