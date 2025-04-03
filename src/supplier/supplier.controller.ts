import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  @Post('create')
  createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.createSupplier(createSupplierDto);
  }

  @Post(':sup_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(@Param('sup_id') sup_id: number, @UploadedFile() file: Express.Multer.File) {
    return await this.supplierService.updateProfilePicture(sup_id, file);
  }


  @Get('getAll')
  // @UseGuards(JwtAuthGuard)
  getAllSupplier() {
    return this.supplierService.getAllSupplier();
  }

  @Get('byId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getSupplierById(@Param('id') id: string) {
    return this.supplierService.getSupplierById(+id);
  }


  @Patch('delete/:id')
  // @UseGuards(JwtAuthGuard)
  deleteSupplier(@Param('id') id: string) {
    return this.supplierService.deleteSupplier(+id);
  }

  @Patch('update/:id')
  // @UseGuards(JwtAuthGuard)
  updateSupplier(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.updateSupplier(+id, updateSupplierDto);
  }
}
