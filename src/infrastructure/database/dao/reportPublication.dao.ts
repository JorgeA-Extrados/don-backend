import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Publication } from "src/publication/entities/publication.entity";
import { ReportPublication } from "src/report-publication/entities/report-publication.entity";
import { ReportReason } from "src/report-reason/entities/report-reason.entity";
import { CreateReportPublicationDto } from "src/report-publication/dto/create-report-publication.dto";
import { PublicationMultimedia } from "src/publication-multimedia/entities/publication-multimedia.entity";



Injectable()
export class ReportPublicationDao {

    constructor(
        @InjectRepository(ReportPublication)
        private reportPublicationRepository: Repository<ReportPublication>,
        @InjectRepository(Publication)
        private publicationRepository: Repository<Publication>,
        @InjectRepository(PublicationMultimedia)
        private publicationMultimediaRepository: Repository<PublicationMultimedia>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ReportReason)
        private reportReasonRepository: Repository<ReportReason>,
    ) { }

    async createReportPublication(createReportPublicationDto: CreateReportPublicationDto): Promise<ReportPublication> {
        try {
            const { usr_id, pub_id, rea_id } = createReportPublicationDto;

            const reportPublication = await this.reportPublicationRepository.create({
                ...createReportPublicationDto,
                rep_state: 'pendiente',
                publication: await this.publicationRepository.create({ pub_id }),
                whoReported: await this.userRepository.create({ usr_id }),
                reportReason: await this.reportReasonRepository.create({ rea_id }),
                rep_create: new Date(),
            });

            const saved = await this.reportPublicationRepository.save(reportPublication, { reload: true });

            return saved;

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getReportPublicationById(repID: number) {
        try {
            // const reportPublication = await this.reportPublicationRepository.findOne({
            //     where: {
            //         rep_id: repID,
            //         rep_delete: IsNull()
            //     },
            //     relations: {
            //         whoReported: {
            //             professional: true,
            //             supplier: true
            //         },
            //         publication: {
            //             publicationMultimedia: true
            //         },
            //         reportReason: true
            //     },
            //     select: {
            //         rep_id: true,
            //         rep_description: true,
            //         rep_create: true,
            //         whoReported: {
            //             usr_id: true,
            //             usr_email: true,
            //             usr_invitationCode: true,
            //             usr_name: true,
            //             usr_role: true,
            //             usr_phone: true,
            //             professional: {
            //                 pro_profilePicture: true,
            //             },
            //             supplier: {
            //                 sup_profilePicture: true
            //             }
            //         },
            //         publication: {
            //             pub_id: true,
            //             pub_description: true,
            //             publicationMultimedia: {
            //                 pmt_file: true,
            //                 pmt_type: true
            //             }
            //         },
            //         reportReason: {
            //             rea_id: true,
            //             rea_reason: true
            //         }
            //     }
            // })

            const reportPublication = await this.reportPublicationRepository
                .createQueryBuilder('reportPublication')
                .leftJoinAndSelect('reportPublication.whoReported', 'whoReported')
                .leftJoinAndSelect('whoReported.professional', 'professional')
                .leftJoinAndSelect('whoReported.supplier', 'supplier')
                .leftJoinAndSelect('reportPublication.publication', 'publication')
                .leftJoinAndSelect('publication.publicationMultimedia', 'publicationMultimedia')
                .leftJoinAndSelect('reportPublication.reportReason', 'reportReason')
                .where('reportPublication.rep_id = :repID', { repID })
                .andWhere('reportPublication.rep_delete IS NULL')
                .select([
                    'reportPublication.rep_id',
                    'reportPublication.rep_description',
                    'reportPublication.rep_create',

                    'whoReported.usr_id',
                    'whoReported.usr_email',
                    'whoReported.usr_invitationCode',
                    'whoReported.usr_name',
                    'whoReported.usr_role',
                    'whoReported.usr_phone',

                    'professional.pro_profilePicture',
                    'supplier.sup_profilePicture',

                    'publication.pub_id',
                    'publication.pub_description',

                    'publicationMultimedia.pmt_file',
                    'publicationMultimedia.pmt_type',

                    'reportReason.rea_id',
                    'reportReason.rea_reason'
                ])
                .getOne();


            return reportPublication

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllReportPublication() {
        try {
            // const reportPublication = await this.reportPublicationRepository.find({
            //     where: {
            //         rep_delete: IsNull()
            //     },
            //     relations: {
            //         whoReported: {
            //             professional: true,
            //             supplier: true
            //         },
            //         publication: {
            //             publicationMultimedia: true
            //         },
            //         reportReason: true
            //     },
            //     select: {
            //         rep_id: true,
            //         rep_description: true,
            //         rep_create: true,
            //         whoReported: {
            //             usr_id: true,
            //             usr_email: true,
            //             usr_invitationCode: true,
            //             usr_name: true,
            //             usr_role: true,
            //             usr_phone: true,
            //             professional: {
            //                 pro_profilePicture: true,
            //             },
            //             supplier: {
            //                 sup_profilePicture: true
            //             }
            //         },
            //         publication: {
            //             pub_id: true,
            //             pub_description: true,
            //             publicationMultimedia: {
            //                 pmt_file: true,
            //                 pmt_type: true
            //             }
            //         },
            //         reportReason: {
            //             rea_id: true,
            //             rea_reason: true
            //         }
            //     }
            // })

            const reportPublication = await this.reportPublicationRepository
                .createQueryBuilder('reportPublication')
                .leftJoinAndSelect('reportPublication.whoReported', 'whoReported')
                .leftJoinAndSelect('whoReported.professional', 'professional')
                .leftJoinAndSelect('whoReported.supplier', 'supplier')
                .leftJoinAndSelect('reportPublication.publication', 'publication')
                .leftJoinAndSelect('publication.publicationMultimedia', 'publicationMultimedia')
                .leftJoinAndSelect('reportPublication.reportReason', 'reportReason')
                .where('reportPublication.rep_delete IS NULL')
                .select([
                    'reportPublication.rep_id',
                    'reportPublication.rep_description',
                    'reportPublication.rep_create',

                    'whoReported.usr_id',
                    'whoReported.usr_email',
                    'whoReported.usr_invitationCode',
                    'whoReported.usr_name',
                    'whoReported.usr_role',
                    'whoReported.usr_phone',

                    'professional.pro_profilePicture',
                    'supplier.sup_profilePicture',

                    'publication.pub_id',
                    'publication.pub_description',

                    'publicationMultimedia.pmt_file',
                    'publicationMultimedia.pmt_type',

                    'reportReason.rea_id',
                    'reportReason.rea_reason'
                ])
                .orderBy('reportPublication.rep_create', 'DESC') // opcional si querés orden
                .getMany();


            return reportPublication

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteReportPublication(repID: number) {
        return await this.reportPublicationRepository
            .update({ rep_id: repID }, {
                rep_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Reporte de publicación eliminada satisfactoriamente',
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

    async updateReportPublication(repID: number, updateReportPublicationDto) {

        return await this.reportPublicationRepository
            .update(
                { rep_id: repID },
                updateReportPublicationDto
            )
            .then(() => {
                return {
                    message: 'Reporte de pubicación actualizada satisfactoriamente',
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

    async getReportPublicationByPUBID(pubID: number) {
        try {
            // const reportPublication = await this.reportPublicationRepository.find({
            //     where: {
            //         publication: { pub_id: pubID },
            //         rep_delete: IsNull()
            //     },
            //     relations: {
            //         whoReported: {
            //             professional: true,
            //             supplier: true
            //         },
            //         publication: {
            //             publicationMultimedia: true
            //         },
            //         reportReason: true
            //     },
            //     select: {
            //         rep_id: true,
            //         rep_description: true,
            //         rep_create: true,
            //         rep_state: true,
            //         whoReported: {
            //             usr_id: true,
            //             usr_email: true,
            //             usr_invitationCode: true,
            //             usr_name: true,
            //             usr_role: true,
            //             usr_phone: true,
            //             professional: {
            //                 pro_profilePicture: true,
            //             },
            //             supplier: {
            //                 sup_profilePicture: true
            //             }
            //         },
            //         publication: {
            //             pub_id: true,
            //             pub_description: true,
            //             publicationMultimedia: {
            //                 pmt_file: true,
            //                 pmt_type: true
            //             }
            //         },
            //         reportReason: {
            //             rea_id: true,
            //             rea_reason: true
            //         }
            //     }
            // })
            const reportPublication = await this.reportPublicationRepository
                .createQueryBuilder('reportPublication')
                .leftJoinAndSelect('reportPublication.whoReported', 'whoReported')
                .leftJoinAndSelect('whoReported.professional', 'professional')
                .leftJoinAndSelect('whoReported.supplier', 'supplier')
                .leftJoinAndSelect('reportPublication.publication', 'publication')
                .leftJoinAndSelect('publication.publicationMultimedia', 'publicationMultimedia')
                .leftJoinAndSelect('reportPublication.reportReason', 'reportReason')
                .where('reportPublication.rep_delete IS NULL')
                .andWhere('publication.pub_id = :pubID', { pubID })
                .select([
                    'reportPublication.rep_id',
                    'reportPublication.rep_description',
                    'reportPublication.rep_create',
                    'reportPublication.rep_state',

                    'whoReported.usr_id',
                    'whoReported.usr_email',
                    'whoReported.usr_invitationCode',
                    'whoReported.usr_name',
                    'whoReported.usr_role',
                    'whoReported.usr_phone',

                    'professional.pro_profilePicture',
                    'supplier.sup_profilePicture',

                    'publication.pub_id',
                    'publication.pub_description',

                    'publicationMultimedia.pmt_file',
                    'publicationMultimedia.pmt_type',

                    'reportReason.rea_id',
                    'reportReason.rea_reason'
                ])
                .getMany();


            return reportPublication

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async updateReportsByAction(pubID: number, state: string, reaID?: number) {
        const queryBuilder = this.reportPublicationRepository
            .createQueryBuilder()
            .update();

        if (state === 'rechazado') {
            queryBuilder
                .set({ rep_state: 'rechazado', rep_delete: new Date() })
                .where('publication = :pubID', { pubID })
                .andWhere('reportReason = :reaID', { reaID })
                .andWhere('rep_delete IS NULL');
        } else if (state === 'aprobado') {
            queryBuilder
                .set({ rep_state: 'aprobado', rep_delete: new Date() })
                .where('publication = :pubID', { pubID })
                .andWhere('rep_delete IS NULL');
        } else {
            throw new Error('Estado no válido');
        }

        return queryBuilder.execute();
    }

    async getAllPendingReportedPublications() {
        // const subQuery = this.reportPublicationRepository
        //     .createQueryBuilder('r')
        //     .innerJoin('r.publication', 'pub')
        //     .innerJoin('r.reportReason', 'rea')
        //     .where('r.rep_state = :state', { state: 'PENDIENTE' })
        //     .andWhere('r.rep_delete IS NULL')
        //     .select([
        //         'pub.pub_id AS pub_id',
        //         'rea.rea_id AS rea_id',
        //         'rea.rea_reason AS rea_reason',
        //         'COUNT(r.rep_id) AS cantidad'
        //     ])
        //     .groupBy('pub.pub_id, rea.rea_id');

        // const rawMotivos = await subQuery.getRawMany();

        // // Agrupamos los motivos por publicación
        // const motivosMap = new Map<number, any[]>();
        // rawMotivos.forEach(row => {
        //     const pubId = row.pub_id;
        //     const motivo = {
        //         rea_id: row.rea_id,
        //         rea_reason: row.rea_reason,
        //         cantidad: Number(row.cantidad)
        //     };

        //     if (!motivosMap.has(pubId)) {
        //         motivosMap.set(pubId, []);
        //     }
        //     const motivos = motivosMap.get(pubId)!; // ¡Safe!
        //     motivos.push(motivo);
        // });

        // // Consulta principal por publicación
        // const publicaciones = await this.reportPublicationRepository
        //     .createQueryBuilder('report')
        //     .innerJoin('report.publication', 'publication')
        //     .leftJoinAndSelect('publication.publicationMultimedia', 'publicationMultimedia')
        //     .where('report.rep_state = :state', { state: 'PENDIENTE' })
        //     .andWhere('report.rep_delete IS NULL')
        //     .select([
        //         'publication.pub_id AS pub_id',
        //         'publication.pub_description AS pub_description',
        //         'publicationMultimedia.pmt_file AS pmt_file',
        //         'publicationMultimedia.pmt_type AS pmt_type',
        //         'COUNT(report.rep_id) AS total_reports'
        //     ])
        //     .groupBy('publication.pub_id')
        //     .getRawMany();

        // console.log('==========publicaciones==========================');
        // console.log(publicaciones);
        // console.log('====================================');

        // // Armamos la respuesta final con los motivos agrupados
        // return publicaciones.map(pub => ({
        //     pub_id: pub.pub_id,
        //     pub_description: pub.pub_description,
        //     publicationMultimedia: pub.publicationMultimedia,
        //     total_reports: Number(pub.total_reports),
        //     motivos: motivosMap.get(pub.pub_id) || []
        // }));

        // Subquery de motivos
        const subQuery = this.reportPublicationRepository
            .createQueryBuilder('r')
            .innerJoin('r.publication', 'pub')
            .innerJoin('r.reportReason', 'rea')
            .where('r.rep_state = :state', { state: 'PENDIENTE' })
            .andWhere('r.rep_delete IS NULL')
            .select([
                'pub.pub_id AS pub_id',
                'rea.rea_id AS rea_id',
                'rea.rea_reason AS rea_reason',
                'COUNT(r.rep_id) AS cantidad'
            ])
            .groupBy('pub.pub_id, rea.rea_id');

        const rawMotivos = await subQuery.getRawMany();

        // Agrupamos los motivos por publicación
        const motivosMap = new Map<number, any[]>();
        rawMotivos.forEach(row => {
            const pubId = row.pub_id;
            const motivo = {
                rea_id: row.rea_id,
                rea_reason: row.rea_reason,
                cantidad: Number(row.cantidad)
            };

            if (!motivosMap.has(pubId)) motivosMap.set(pubId, []);
            motivosMap.get(pubId)!.push(motivo);
        });

        // Publicaciones base
        const publicaciones = await this.reportPublicationRepository
            .createQueryBuilder('report')
            .innerJoin('report.publication', 'publication')
            .where('report.rep_state = :state', { state: 'PENDIENTE' })
            .andWhere('report.rep_delete IS NULL')
            .select([
                'publication.pub_id AS pub_id',
                'publication.pub_description AS pub_description',
                'COUNT(report.rep_id) AS total_reports'
            ])
            .groupBy('publication.pub_id')
            .getRawMany();

        // Multimedia por publicación (sin groupBy aquí)
        const multimedia = await this.publicationMultimediaRepository
            .createQueryBuilder('multimedia')
            .innerJoin('multimedia.publication', 'publication')
            .select([
                'publication.pub_id AS pub_id',
                'multimedia.pmt_file AS pmt_file',
                'multimedia.pmt_type AS pmt_type'
            ])
            .getRawMany();

        // Agrupamos multimedia por pub_id
        const multimediaMap = new Map<number, any[]>();
        multimedia.forEach(item => {
            const pubId = item.pub_id;
            const media = {
                pmt_file: item.pmt_file,
                pmt_type: item.pmt_type
            };

            if (!multimediaMap.has(pubId)) multimediaMap.set(pubId, []);
            multimediaMap.get(pubId)!.push(media);
        });

        // Armamos la respuesta final
        return publicaciones.map(pub => ({
            pub_id: pub.pub_id,
            pub_description: pub.pub_description,
            publicationMultimedia: multimediaMap.get(pub.pub_id) || [],
            total_reports: Number(pub.total_reports),
            motivos: motivosMap.get(pub.pub_id) || []
        }));
    }

    async deleteReportPublicationFisicaById(pubID: number): Promise<void> {
        try {
            await this.reportPublicationRepository.delete(pubID);
        } catch (error) {
            throw new Error(`Error eliminando el reporte con id ${pubID}: ${error.message}`);
        }
    }


}