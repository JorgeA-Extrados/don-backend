import { IsNumber } from "class-validator";
import { Publication } from "src/publication/entities/publication.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";




@Entity('user_viewed_admin_publication')
export class UserViewedAdminPublication {

    @PrimaryGeneratedColumn({
        name: 'udp_id',
    })
    @IsNumber()
    udp_id: number;

    @Column({
        name: 'udp_viewed_at',
        nullable: false,
    })
    udp_viewed_at: Date;

    @ManyToOne(() => User, user => user.userViewedAdminPublication)
    @JoinColumn({ name: 'usr_id' })
    user: User;

    @ManyToOne(() => Publication, publication => publication.userViewedAdminPublication)
    @JoinColumn({ name: 'pub_id' })
    publication: Publication;
}
