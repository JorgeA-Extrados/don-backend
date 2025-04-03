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
                error: `Internal Server Error`,
            });
        }
    }

    async getSupplierById(supID: number) {
        try {
            const supplier = await this.supplierRepository.findOne({
                where: {
                    sup_id: supID,
                    sup_delete: IsNull()
                }
            })

            return supplier

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Internal Server Error`,
            });
        }
    }

    async getAllSupplier() {
        try {
            const supplier = await this.supplierRepository.find({
                where: {
                    sup_delete: IsNull()
                }
            })

            return supplier

        } catch (error) {
            throw new BadRequestException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `${error.code} ${error.detail} ${error.message}`,
                error: `Internal Server Error`,
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
                    message: 'Supplier delete successfully',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Internal Server Error',
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
                    message: 'Supplier updated successfully',
                    statusCode: HttpStatus.CREATED,
                };
            })
            .catch((error) => {
                throw new BadRequestException({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: [`${error.message}`],
                    error: 'Internal Server Error',
                });
            });
    }

}