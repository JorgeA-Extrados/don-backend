import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreditsDonService } from './credits-don.service';
import { CreateCreditsDonDto } from './dto/create-credits-don.dto';
import { UpdateCreditsDonDto } from './dto/update-credits-don.dto';

@Controller('credits-don')
export class CreditsDonController {
  constructor(private readonly creditsDonService: CreditsDonService) {}

 @Post('create')
 createCreditsDON(@Body() createCreditsDonDto: CreateCreditsDonDto) {
    return this.creditsDonService.createCreditsDON(createCreditsDonDto);
  }

  @Get('getAll')
  // @UseGuards(JwtAuthGuard)
  getAllCreditsDon() {
    return this.creditsDonService.getAllCreditsDon();
  }

  @Get('byId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getCreditsDonById(@Param('id') id: string) {
    return this.creditsDonService.getCreditsDonById(+id);
  }

  @Get('byUsrId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getCreditsDonByUsrId(@Param('id') id: string) {
    return this.creditsDonService.getCreditsDonByUsrId(+id);
  }

  @Get('byUsrId-total/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getCreditsDonTotalByUsrId(@Param('id') id: string) {
    return this.creditsDonService.getCreditsDonTotalByUsrId(+id);
  }


  @Patch('delete/:id')
  // @UseGuards(JwtAuthGuard)
  deleteCreditsDon(@Param('id') id: string) {
    return this.creditsDonService.deleteCreditsDon(+id);
  }

  @Patch('update/:id')
  // @UseGuards(JwtAuthGuard)
  updateCreditsDon(@Param('id') id: string, @Body() updateCreditsDonDto: UpdateCreditsDonDto) {
    return this.creditsDonService.updateCreditsDon(+id, updateCreditsDonDto);
  }
}
