import { IsDateString, IsNumber, IsOptional } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";




@Entity('professional_recommendation')
export class ProfessionalRecommendation {

    @PrimaryGeneratedColumn({
        name: 'prr_id',
    })
    @IsNumber()
    prr_id: number;

    @Column({
        name: 'prr_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    prr_create?: Date;

    @Column({
        name: 'prr_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    prr_update?: Date;

    @Column({
        name: 'prr_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    prr_delete?: Date;

    @ManyToOne(() => User, user => user.professionalRecommendationFrom)
    @JoinColumn({ name: 'usr_id_from' })
    from: User; // quien recomienda

    @ManyToOne(() => User, user => user.professionalRecommendationTo)
    @JoinColumn({ name: 'usr_id_to' })
    to: User; // a quien se recomienda
}
