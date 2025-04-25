import { IsDateString, IsNumber, IsOptional } from "class-validator";
import { Heading } from "src/heading/entities/heading.entity";
import { SubHeading } from "src/sub-heading/entities/sub-heading.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('user_heading')
export class UserHeading {

    @PrimaryGeneratedColumn({
        name: 'ush_id',
    })
    @IsNumber()
    ush_id: number;

    @Column({
        name: 'ush_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    ush_create?: Date;

    @Column({
        name: 'ush_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    ush_update?: Date;

    @Column({
        name: 'ush_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    ush_delete?: Date;

    @ManyToOne(() => User, user => user.userHeading)
    @JoinColumn({ name: 'usr_id' })
    user: User;

    @ManyToOne(() => Heading, heading => heading.userHeading)
    @JoinColumn({ name: 'hea_id' })
    heading: Heading;

    @ManyToOne(() => SubHeading, subHeading => subHeading.userHeading)
    @JoinColumn({ name: 'sbh_id' })
    @IsOptional()
    subHeading?: SubHeading;
 }
