import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('supplier')
export class Supplier {

    @PrimaryGeneratedColumn({
        name: 'sup_id',
    })
    @IsNumber()
    sup_id: number;

    @Column({
        name: 'sup_firstName'
    })
    @IsNotEmpty()
    @IsString()
    sup_firstName: string;

    @Column({
        name: 'sup_lastName'
    })
    @IsNotEmpty()
    @IsString()
    sup_lastName: string;

    @Column({
        name: 'sup_latitude'
    })
    @IsNotEmpty()
    @IsString()
    sup_latitude: string;

    @Column({
        name: 'sup_longitude'
    })
    @IsNotEmpty()
    @IsString()
    sup_longitude: string;

    @Column({
        name: 'sup_profilePicture',
        nullable: true,
        type: 'varchar',
        length: 2083,
    })
    @IsOptional()
    @IsString()
    sup_profilePicture?: string;

    @Column({
        name: 'sup_description',
        nullable: true,
        type: 'varchar',
        length: 300,
    })
    @IsOptional()
    @IsString()
    sup_description?: string;

    // @Column({
    //     name: 'sup_creditDON',
    //     nullable: true,
    // })
    // @IsOptional()
    // @IsString()
    // sup_creditDON?: string;

    @Column({
        name: 'sup_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    sup_create?: Date;

    @Column({
        name: 'sup_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    sup_update?: Date;

    @Column({
        name: 'sup_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    sup_delete?: Date;

    @OneToOne(() => User, user => user.supplier, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usr_id' })
    user: User;
}
