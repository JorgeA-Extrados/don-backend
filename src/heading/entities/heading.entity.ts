import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SubHeading } from "src/sub-heading/entities/sub-heading.entity";
import { UserHeading } from "src/user-heading/entities/user-heading.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('heading')
export class Heading {

    @PrimaryGeneratedColumn({
        name: 'hea_id',
    })
    @IsNumber()
    hea_id: number;

    @Column({
        name: 'hea_name'
    })
    @IsNotEmpty()
    @IsString()
    hea_name: string;

    @Column({
        name: 'hea_icon'
    })
    @IsNotEmpty()
    @IsString()
    hea_icon: string;

    @Column({
        name: 'hea_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    hea_create?: Date;

    @Column({
        name: 'hea_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    hea_update?: Date;

    @Column({
        name: 'hea_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    hea_delete?: Date;

    @OneToMany(() => SubHeading, subHeading => subHeading.heading)
    subHeading: SubHeading;

    @OneToMany(() => UserHeading, userHeading => userHeading.heading)
    userHeading: UserHeading;
}
