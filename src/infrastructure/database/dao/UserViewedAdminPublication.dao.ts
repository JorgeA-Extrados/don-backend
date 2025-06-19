import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Publication } from "src/publication/entities/publication.entity";
import { User } from "src/user/entities/user.entity";
import { UserViewedAdminPublication } from "src/user_viewed_admin_publication/entities/user_viewed_admin_publication.entity";
import { Repository } from "typeorm";






@Injectable()
export class UserViewedAdminPublicationDao {
    constructor(
        @InjectRepository(UserViewedAdminPublication)
        private readonly userViewedAdminPublication: Repository<UserViewedAdminPublication>,
        @InjectRepository(Publication)
        private publicationRepository: Repository<Publication>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async saveViews(userId: number, pubIds: number) {
        try {
            const userViewdAdminPublication = await this.userViewedAdminPublication.create({
                user: await this.userRepository.create({ usr_id: userId }),
                publication: await this.publicationRepository.create({ pub_id: pubIds }),
            })

            return await this.publicationRepository.save(userViewdAdminPublication, { reload: true })

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async hasViewed(userId: number, pubId: number) {
        try {
            const existing = await this.userViewedAdminPublication.findOneBy({ user: { usr_id: userId }, publication: { pub_id: pubId } });

            return existing;
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getViewedPublicationsByUser(userId: number) {
        try {
            return await this.userViewedAdminPublication.find({ where: { user: { usr_id: userId } } });
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteViewedByUser(userId: number) {
        try {
            return await this.userViewedAdminPublication.delete({ user: { usr_id: userId } });
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }
}
