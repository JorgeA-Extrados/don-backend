import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { RefreshToken } from "src/auth/entities/refresh-token.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";



@Entity('users')
@Unique('USR_UK', ['usr_email'])
export class User {

    @PrimaryGeneratedColumn({
        name: 'usr_id',
    })
    @IsNumber()
    usr_id: number;

    @Column({
        name: 'usr_email',
    })
    @IsNotEmpty()
    @IsEmail()
    usr_email: string;

    @Column({
        name: 'usr_password',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_password?: string;

    @Column({
        name: 'usr_invitationCode',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_invitationCode?: string;

    @Column({
        name: 'usr_firstName',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_firstName?: string;

    @Column({
        name: 'usr_lastName',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_lastName?: string;

    @Column({
        name: 'usr_address',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_address?: string;

    @Column({
        name: 'usr_name',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_name?: string;

    @Column({
        name: 'usr_role',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_role?: string;

    @Column({
        name: 'usr_profilePicture',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_profilePicture?: string;

    @Column({
        name: 'usr_phone',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_phone?: string;

    @Column({
        name: 'usr_creditDON',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_creditDON?: string;

    @Column({
        name: 'usr_active',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    usr_active?: string;

    @Column({
        name: 'usr_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    usr_create?: Date;

    @Column({
        name: 'usr_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    usr_update?: Date;

    @Column({
        name: 'usr_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    usr_delete?: Date;

    @OneToOne(() => RefreshToken, refresh => refresh.user)
    refreshToken: RefreshToken;
}

