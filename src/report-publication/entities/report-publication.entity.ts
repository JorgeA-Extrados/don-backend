import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Publication } from "src/publication/entities/publication.entity";
import { ReportReason } from "src/report-reason/entities/report-reason.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('report_publication')
export class ReportPublication {

    @PrimaryGeneratedColumn({
        name: 'rep_id',
    })
    @IsNumber()
    rep_id: number;


    @Column({
        name: 'rep_description'
    })
    @IsNotEmpty()
    @IsString()
    rep_description: string;

    @Column({
        name: 'rep_state',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    rep_state?: string;

    @Column({
        name: 'rep_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    rep_create?: Date;

    @Column({
        name: 'rep_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    rep_update?: Date;

    @Column({
        name: 'rep_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    rep_delete?: Date;

    @ManyToOne(() => Publication, publication => publication.reportPublication)
    @JoinColumn({ name: 'pub_id' })
    publication: Publication;

    @ManyToOne(() => User, user => user.reportPublication)
    @JoinColumn({ name: 'usr_id' })
    whoReported: User;

    @ManyToOne(() => ReportReason, reportReason => reportReason.reportPublication)
    @JoinColumn({ name: 'rea_id' })
    reportReason: ReportReason;
}
