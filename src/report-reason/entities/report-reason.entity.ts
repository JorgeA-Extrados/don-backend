import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ReportPublication } from "src/report-publication/entities/report-publication.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('report_reason')
export class ReportReason {

    @PrimaryGeneratedColumn({
        name: 'rea_id',
    })
    @IsNumber()
    rea_id: number;


    @Column({
        name: 'rea_reason'
    })
    @IsNotEmpty()
    @IsString()
    rea_reason: string;

    @Column({
        name: 'rea_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    rea_create?: Date;

    @Column({
        name: 'rea_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    rea_update?: Date;

    @Column({
        name: 'rea_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    rea_delete?: Date;

    @OneToMany(() => ReportPublication, reportPublication => reportPublication.reportReason)
    reportPublication: ReportPublication;
}
