import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreditsDonService } from './credits-don.service';
import { CreateCreditsDonDto } from './dto/create-credits-don.dto';
import { UpdateCreditsDonDto } from './dto/update-credits-don.dto';

@Controller('credits-don')
export class CreditsDonController {
  constructor(private readonly creditsDonService: CreditsDonService) {}

  @Post()
  create(@Body() createCreditsDonDto: CreateCreditsDonDto) {
    return this.creditsDonService.create(createCreditsDonDto);
  }

  @Get()
  findAll() {
    return this.creditsDonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditsDonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditsDonDto: UpdateCreditsDonDto) {
    return this.creditsDonService.update(+id, updateCreditsDonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditsDonService.remove(+id);
  }
}
