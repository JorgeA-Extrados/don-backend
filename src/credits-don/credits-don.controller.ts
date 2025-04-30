import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreditsDonService } from './credits-don.service';
import { CreateCreditsDonDto } from './dto/create-credits-don.dto';
import { UpdateCreditsDonDto } from './dto/update-credits-don.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('credits-don')
export class CreditsDonController {
  constructor(private readonly creditsDonService: CreditsDonService) { }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createCreditsDON(@Body() createCreditsDonDto: CreateCreditsDonDto) {
    return this.creditsDonService.createCreditsDON(createCreditsDonDto);
  }

  @Get('getAll/Admin')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  getAllCreditsDon() {
    return this.creditsDonService.getAllCreditsDon();
  }

  @Get('byId/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getCreditsDonById(@Param('id') id: string) {
    return this.creditsDonService.getCreditsDonById(+id);
  }

  @Get('byUsrId/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getCreditsDonByUsrId(@Param('id') id: string) {
    return this.creditsDonService.getCreditsDonByUsrId(+id);
  }

  @Get('byUsrId-total/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getCreditsDonTotalByUsrId(@Param('id') id: string) {
    return this.creditsDonService.getCreditsDonTotalByUsrId(+id);
  }


  @Patch('delete/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  deleteCreditsDon(@Param('id') id: string) {
    return this.creditsDonService.deleteCreditsDon(+id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard)
  updateCreditsDon(@Param('id') id: string, @Body() updateCreditsDonDto: UpdateCreditsDonDto) {
    return this.creditsDonService.updateCreditsDon(+id, updateCreditsDonDto);
  }
}
