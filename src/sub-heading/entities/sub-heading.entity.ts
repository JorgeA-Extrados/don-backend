import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Heading } from "src/heading/entities/heading.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('subHeading')
export class SubHeading {

    @PrimaryGeneratedColumn({
        name: 'sbh_id',
    })
    @IsNumber()
    sbh_id: number;

    @Column({
        name: 'sbh_name'
    })
    @IsNotEmpty()
    @IsString()
    sbh_name: string;

    @Column({
        name: 'sbh_icon'
    })
    @IsNotEmpty()
    @IsString()
    sbh_icon: string;

    @Column({
        name: 'sbh_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    sbh_create?: Date;
    
    @Column({
        name: 'sbh_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    sbh_update?: Date;
    
    @Column({
        name: 'sbh_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    sbh_delete?: Date;


    @ManyToOne(() => Heading, heading => heading.subHeading)
    @JoinColumn({ name: 'hea_id' })
    heading: Heading;
}
