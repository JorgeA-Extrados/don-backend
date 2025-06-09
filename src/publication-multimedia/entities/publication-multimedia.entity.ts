import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Publication } from "src/publication/entities/publication.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('pubication_multimedia')
export class PublicationMultimedia {

    @PrimaryGeneratedColumn({
        name: 'pmt_id',
    })
    @IsNumber()
    pmt_id: number;


    @Column({
        name: 'pmt_file',
        nullable: false,
        type: 'varchar',
        length: 2083,
    })
    @IsNotEmpty()
    @IsString()
    pmt_file: string;


    @Column({
        name: 'pmt_type',
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    pmt_type: string;

    @Column({
        name: 'pmt_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    pmt_create?: Date;

    @Column({
        name: 'pmt_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    pmt_update?: Date;

    @Column({
        name: 'pmt_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    pmt_delete?: Date;

    @ManyToOne(() => Publication, publication => publication.publicationMultimedia)
    @JoinColumn({ name: 'pub_id' })
    publication: Publication;

}
