import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserViewedAdminPublicationService } from './user_viewed_admin_publication.service';
import { CreateUserViewedAdminPublicationDto } from './dto/create-user_viewed_admin_publication.dto';
import { UpdateUserViewedAdminPublicationDto } from './dto/update-user_viewed_admin_publication.dto';

@Controller('user-viewed-admin-publication')
export class UserViewedAdminPublicationController {
  constructor(private readonly userViewedAdminPublicationService: UserViewedAdminPublicationService) {}

  @Post()
  create(@Body() createUserViewedAdminPublicationDto: CreateUserViewedAdminPublicationDto) {
    return this.userViewedAdminPublicationService.create(createUserViewedAdminPublicationDto);
  }

  @Get()
  findAll() {
    return this.userViewedAdminPublicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userViewedAdminPublicationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserViewedAdminPublicationDto: UpdateUserViewedAdminPublicationDto) {
    return this.userViewedAdminPublicationService.update(+id, updateUserViewedAdminPublicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userViewedAdminPublicationService.remove(+id);
  }
}
