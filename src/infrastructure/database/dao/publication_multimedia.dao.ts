import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Publication } from "src/publication/entities/publication.entity";
import { PublicationMultimedia } from "src/publication-multimedia/entities/publication-multimedia.entity";
import { CreatePublicationMultimediaDto } from "src/publication-multimedia/dto/create-publication-multimedia.dto";



Injectable()
export class PublicationMultimediaDao {

    constructor(
        @InjectRepository(PublicationMultimedia)
        private publicationMultimedia: Repository<PublicationMultimedia>,
        @InjectRepository(Publication)
        private publicationRepository: Repository<Publication>,
    ) { }

    async createPublicationMultimedia(createPublicationMultimediaDto: CreatePublicationMultimediaDto) {
        try {
            const { pub_id } = createPublicationMultimediaDto
            const publicationMultimedia = await this.publicationMultimedia.create({
                ...createPublicationMultimediaDto,
                publication: await this.publicationRepository.create({ pub_id }),
                pmt_create: new Date(),
            })

            return await this.publicationMultimedia.save(publicationMultimedia, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deletePublicationMultimedia(pubID: number) {
        return await this.publicationMultimedia
            .update({ pmt_id: pubID }, {
                pmt_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Multimedia eliminada satisfactoriamente',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Error Interno del Servidor',
                });
            });
    }

    async getPUblicationImageByPubID(pubID: number) {
        try {
            const publication = await this.publicationMultimedia.find({
                where: {
                    publication: { pub_id: pubID }
                }
            })

            return publication
        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deletePublicationMultimediaPhysicsById(pmtId: number): Promise<void> {
        try {
            await this.publicationMultimedia.delete(pmtId);
        } catch (error) {
             throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

}