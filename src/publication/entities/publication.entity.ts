import { IsDateString, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { PublicationMultimedia } from "src/publication-multimedia/entities/publication-multimedia.entity";
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
        name: 'pub_description',
        nullable: true,
        type: 'varchar',
        length: 250,
    })
    @IsOptional()
    @IsString()
    @MaxLength(250, { message: 'La descripción no puede superar los 250 caracteres.' })
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
    
    @OneToMany(() => PublicationMultimedia, publicationMultimedia => publicationMultimedia.publication)
    publicationMultimedia: PublicationMultimedia;
}
