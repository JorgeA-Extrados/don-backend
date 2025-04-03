import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('create')
  createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.createSupplier(createSupplierDto);
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
