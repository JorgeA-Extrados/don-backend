import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { ReportPublication } from "src/report-publication/entities/report-publication.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('publication')
export class Publication {

    @PrimaryGeneratedColumn({
        name: 'pub_id',
    })
    @IsNumber()
    pub_id: number;


    @Column({
        name: 'pub_image',
        nullable: true,
        type: 'varchar',
        length: 2083,
    })
    @IsOptional()
    @IsString()
    pub_image?: string;

    @Column({
        name: 'pub_description'
    })
    @IsOptional()
    @IsString()
    pub_description?: string;

    @Column({
        name: 'pub_reason_for_deletion',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    pub_reason_for_deletion?: string;

    @Column({
        name: 'pub_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    pub_create?: Date;

    @Column({
        name: 'pub_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    pub_update?: Date;

    @Column({
        name: 'pub_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    pub_delete?: Date;

    @ManyToOne(() => User, user => user.publication)
    @JoinColumn({ name: 'usr_id' })
    user: User;

    @OneToMany(() => ReportPublication, reportPublication => reportPublication.publication)
    reportPublication: ReportPublication;
}
