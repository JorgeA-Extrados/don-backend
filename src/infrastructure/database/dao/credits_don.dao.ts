import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { CreditsDon } from "src/credits-don/entities/credits-don.entity";
import { CreditsReason } from "src/credits-reason/entities/credits-reason.entity";



Injectable()
export class CreditsDonDao {

    constructor(
        @InjectRepository(CreditsDon)
        private creditsDonRepository: Repository<CreditsDon>,
        @InjectRepository(CreditsReason)
        private creditsReasonRepository: Repository<CreditsReason>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createCreditsDON(createCreditsDonDto) {
        try {
            const { usr_id, crs_id } = createCreditsDonDto
            const creditsDon = await this.creditsDonRepository.create({
                ...createCreditsDonDto,
                creditsReason: await this.creditsReasonRepository.create({ crs_id }),
                assigningUser: await this.userRepository.create({ usr_id }),
                cre_create: new Date(),
            })

            return await this.creditsDonRepository.save(creditsDon, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getCreditsDonById(creID: number) {
        try {
            const creditsDon = await this.creditsDonRepository.findOne({
                where: {
                    cre_id: creID,
                    cre_delete: IsNull()
                },
                relations: {
                    assigningUser: {
                        professional: true,
                        supplier: true
                    },
                    creditsReason: true,
                }
            })

            return creditsDon

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllCreditsDon() {
        try {
            const creditsDon = await this.creditsDonRepository.find({
                where: {
                    cre_delete: IsNull(),
                    cre_isAdmin: true,
                },
                relations: {
                    assigningUser: {
                        professional: true,
                        supplier: true
                    },
                    creditsReason: true,
                },
                select: {
                    cre_id: true,
                    cre_amount: true,
                    cre_isCredits: true,
                    cre_isAdmin: true,
                    creditsReason: {
                        crs_id: true,
                        crs_reason: true,
                    },
                    assigningUser: {
                        usr_id: true,
                        usr_email: true,
                        usr_name: true,
                        usr_role: true,
                        usr_phone: true,
                        professional: {
                            pro_id: true,
                            pro_firstName: true,
                            pro_lastName: true,
                            pro_profilePicture: true,
                        },
                        supplier: {
                            sup_id: true,
                            sup_firstName: true,
                            sup_lastName: true,
                            sup_profilePicture: true,
                        }
                    }
                }
            })

            return creditsDon

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteCreditsDon(creID: number) {
        return await this.creditsDonRepository
            .update({ cre_id: creID }, {
                cre_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Credito DON eliminado satisfactoriamente',
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

    async deleteCreditsDonPhysics(pmtId: number): Promise<void> {
        try {
            await this.creditsDonRepository.delete(pmtId);
        } catch (error) {
           throw new BadRequestException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`${error.message}`],
                error: 'Error Interno del Servidor',
            });
        }
    }

    async updateCreditsDon(creID: number, updateCreditsDonDto) {

        return await this.creditsDonRepository
            .update(
                { cre_id: creID },
                updateCreditsDonDto
            )
            .then(() => {
                return {
                    message: 'Credito DON actualizado satisfactoriamente',
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


    async getCreditsDonByUsrId(usrID: number) {
        try {
            const historial = await this.creditsDonRepository.find({
                where: {
                    assigningUser: { usr_id: usrID },
                    cre_delete: IsNull()
                },
                relations: {
                    // assigningUser: {
                    //     professional: true,
                    //     supplier: true
                    // },
                    creditsReason: true
                },
                select: {
                    cre_id: true,
                    cre_amount: true,
                    cre_create: true,
                    cre_isCredits: true,
                    creditsReason: {
                        crs_id: true,
                        crs_reason: true,
                    },
                    // assigningUser: {
                    //     usr_id: true,
                    //     usr_email: true,
                    //     usr_name: true,
                    //     usr_role: true,
                    //     supplier: {
                    //         sup_id: true,
                    //         sup_firstName: true,
                    //         sup_lastName: true,
                    //         sup_profilePicture: true,
                    //     },
                    //     professional: {
                    //         pro_id: true,
                    //         pro_firstName: true,
                    //         pro_lastName: true,
                    //         pro_profilePicture: true,
                    //     }
                    // }
                },
                order: {
                    cre_create: 'DESC' // opcional: historial ordenado
                }
            });

            // Sumar los créditos
            const total = historial.reduce((acc, credit) => acc + credit.cre_amount, 0);

            return {
                total,
                historial
            };

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getCreditsDonTotalByUsrId(usrID: number) {
        try {
            const historial = await this.creditsDonRepository.find({
                where: {
                    assigningUser: { usr_id: usrID },
                    cre_delete: IsNull()
                },
            });

            // Sumar los créditos
            const total = historial.reduce((acc, credit) => acc + credit.cre_amount, 0);

            return {
                total
            };

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getCreditsDonByUsrIdDelete(usrID: number) {
        try {
            const creditsDon = await this.creditsDonRepository.find({
                where: {
                    assigningUser: { usr_id: usrID },
                    cre_delete: IsNull()
                },
            });

            return creditsDon

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getCreditsDonDeleteByUsrIdDelete(usrID: number) {
        try {
            const creditsDon = await this.creditsDonRepository.find({
                where: {
                    assigningUser: { usr_id: usrID }
                },
            });

            return creditsDon

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

}