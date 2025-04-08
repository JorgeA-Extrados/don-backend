import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('professional')
export class Professional {

    @PrimaryGeneratedColumn({
        name: 'pro_id',
    })
    @IsNumber()
    pro_id: number;

    @Column({
        name: 'pro_firstName'
    })
    @IsNotEmpty()
    @IsString()
    pro_firstName: string;

    @Column({
        name: 'pro_lastName'
    })
    @IsNotEmpty()
    @IsString()
    pro_lastName: string;

    @Column({
        name: 'pro_latitude'
    })
    @IsNotEmpty()
    @IsString()
    pro_latitude: string;

    @Column({
        name: 'pro_longitude'
    })
    @IsNotEmpty()
    @IsString()
    pro_longitude: string;

    // @Column({
    //     name: 'pro_address'
    // })
    // @IsNotEmpty()
    // @IsString()
    // pro_address: string;


    @Column({
        name: 'pro_profilePicture',
        nullable: true,
        type: 'varchar',
        length: 2083,
    })
    @IsOptional()
    @IsString()
    pro_profilePicture?: string;

    @Column({
        name: 'pro_description',
        nullable: true,
        type: 'varchar',
        length: 300,
    })
    @IsOptional()
    @IsString()
    pro_description?: string;

    @Column({
        name: 'pro_creditDON',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    pro_creditDON?: string;

    @Column({
        name: 'pro_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    pro_create?: Date;

    @Column({
        name: 'pro_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    pro_update?: Date;

    @Column({
        name: 'pro_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    pro_delete?: Date;

    @OneToOne(() => User, user => user.professional, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usr_id' })
    user: User;

}
