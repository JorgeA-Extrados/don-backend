import { Injectable } from '@nestjs/common';
import { CreateUserHeadingDto } from './dto/create-user-heading.dto';
import { UpdateUserHeadingDto } from './dto/update-user-heading.dto';

@Injectable()
export class UserHeadingService {
  create(createUserHeadingDto: CreateUserHeadingDto) {
    return 'This action adds a new userHeading';
  }

  findAll() {
    return `This action returns all userHeading`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userHeading`;
  }

  update(id: number, updateUserHeadingDto: UpdateUserHeadingDto) {
    return `This action updates a #${id} userHeading`;
  }

  remove(id: number) {
    return `This action removes a #${id} userHeading`;
  }
}
