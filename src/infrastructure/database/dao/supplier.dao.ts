import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Supplier } from "src/supplier/entities/supplier.entity";



Injectable()
export class SupplierDao {

    constructor(
        @InjectRepository(Supplier)
        private supplierRepository: Repository<Supplier>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createSupplier(createSupplierDto) {
        try {
            const {usr_id} = createSupplierDto
            const supplier = await this.supplierRepository.create({
                ...createSupplierDto,
                user: await this.userRepository.create({usr_id}),
                sup_create: new Date(),
            })

            return await this.supplierRepository.save(supplier, { reload: true })

        } catch (error) {

            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getSupplierById(supID: number) {
        try {
            const supplier = await this.supplierRepository.findOne({
                where: {
                    sup_id: supID,
                    sup_delete: IsNull()
                },
                relations: {
                    user: true
                },
                select: {
                    sup_id: true,
                    sup_firstName: true,
                    sup_lastName: true,
                    sup_latitude: true,
                    sup_longitude: true,
                    sup_profilePicture: true,
                    user: {
                        usr_id: true,
                        usr_email: true,
                        usr_name: true,
                        usr_phone: true
                    }
                }
            })

            return supplier

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async getAllSupplier() {
        try {
            const supplier = await this.supplierRepository.find({
                where: {
                    sup_delete: IsNull()
                },
                relations: {
                    user: true
                },
                select: {
                    sup_id: true,
                    sup_firstName: true,
                    sup_lastName: true,
                    sup_latitude: true,
                    sup_longitude: true,
                    sup_profilePicture: true,
                    user: {
                        usr_id: true,
                        usr_email: true,
                        usr_name: true,
                        usr_phone: true
                    }
                }
            })

            return supplier

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Error Interno del Servidor`,
            });
        }
    }

    async deleteSupplier(supID: number) {
        return await this.supplierRepository
            .update({ sup_id: supID }, {
                sup_delete: new Date(),
            })
            .then(() => {
                return {
                    message: 'Proveedor eliminado satisfactoriamente',
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

    async updateSupplier(supID: number, updateSupplierDto) {

        return await this.supplierRepository
            .update(
                { sup_id: supID },
                updateSupplierDto
            )
            .then(() => {
                return {
                    message: 'Proveerdo actualizado satisfactoriamente',
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

}