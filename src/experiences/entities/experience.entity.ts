import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "src/categories/entities/category.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('experience')
export class Experience {

    @PrimaryGeneratedColumn({
        name: 'exp_id',
    })
    @IsNumber()
    exp_id: number;

    @Column({
        name: 'exp_documentation',
    })
    @IsNotEmpty()
    @IsString()
    exp_documentation: string;

    @Column({
        name: 'exp_note',
    })
    @IsNotEmpty()
    @IsString()
    exp_note: string;

    @Column({
        name: 'exp_image',
    })
    @IsNotEmpty()
    @IsString()
    exp_image: string;

    @Column({
        name: 'exp_create',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    exp_create?: Date;

    @Column({
        name: 'exp_update',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    exp_update?: Date;

    @Column({
        name: 'exp_delete',
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    exp_delete?: Date;

    @ManyToOne(() => User, user => user.userExperience)
    @JoinColumn({ name: 'usr_id' })
    usr_id: User;

    @ManyToOne(() => Category, category => category.categoryExperience)
    @JoinColumn({ name: 'cat_id' })
    cat_id: Category;
}
