import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('servicesSearch')
export class ServicesSearch {

    @PrimaryGeneratedColumn({
        name: 'sea_id',
    })
    @IsNumber()
    sea_id: number;

    @Column({
        name: 'sea_firstName'
    })
    @IsNotEmpty()
    @IsString()
    sea_firstName: string;

    @Column({
        name: 'sea_lastName'
    })
    @IsNotEmpty()
    @IsString()
    sea_lastName: string;

    @Column({
        name: 'sea_latitude'
    })
    @IsNotEmpty()
    @IsString()
    sea_latitude: string;

    @Column({
        name: 'sea_longitude'
    })
    @IsNotEmpty()
    @IsString()
    sea_longitude: string;

    @Column({
        name: 'sea_profilePicture',
        nullable: true,
        type: 'varchar',
        length: 2083,
    })
    @IsOptional()
    @IsString()
    sea_profilePicture?: string;

    @Column({
        name: 'sea_description',
        nullable: true,
        type: 'varchar',
        length: 140,
    })
    @IsOptional()
    @IsString()
    sea_description?: string;

    // @Column({
    //     name: 'sea_creditDON',
    //     nullable: true,
    // })
    // @IsOptional()
    // @IsString()
    // sea_creditDON?: string;

    @Column({
        name: 'sea_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    sea_create?: Date;

    @Column({
        name: 'sea_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    sea_update?: Date;

    @Column({
        name: 'sea_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    sea_delete?: Date;

    @OneToOne(() => User, user => user.servicesSearch, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usr_id' })
    user: User;
}
