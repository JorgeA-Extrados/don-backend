import { Injectable } from '@nestjs/common';
import { CreateCreditsDonDto } from './dto/create-credits-don.dto';
import { UpdateCreditsDonDto } from './dto/update-credits-don.dto';

@Injectable()
export class CreditsDonService {
  create(createCreditsDonDto: CreateCreditsDonDto) {
    return 'This action adds a new creditsDon';
  }

  findAll() {
    return `This action returns all creditsDon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} creditsDon`;
  }

  update(id: number, updateCreditsDonDto: UpdateCreditsDonDto) {
    return `This action updates a #${id} creditsDon`;
  }

  remove(id: number) {
    return `This action removes a #${id} creditsDon`;
  }
}
