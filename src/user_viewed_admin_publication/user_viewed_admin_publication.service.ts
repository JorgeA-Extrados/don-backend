import { Injectable } from '@nestjs/common';
import { CreateUserViewedAdminPublicationDto } from './dto/create-user_viewed_admin_publication.dto';
import { UpdateUserViewedAdminPublicationDto } from './dto/update-user_viewed_admin_publication.dto';

@Injectable()
export class UserViewedAdminPublicationService {
  create(createUserViewedAdminPublicationDto: CreateUserViewedAdminPublicationDto) {
    return 'This action adds a new userViewedAdminPublication';
  }

  findAll() {
    return `This action returns all userViewedAdminPublication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userViewedAdminPublication`;
  }

  update(id: number, updateUserViewedAdminPublicationDto: UpdateUserViewedAdminPublicationDto) {
    return `This action updates a #${id} userViewedAdminPublication`;
  }

  remove(id: number) {
    return `This action removes a #${id} userViewedAdminPublication`;
  }
}
