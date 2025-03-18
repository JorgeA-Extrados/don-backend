import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getAll')
  // @UseGuards(JwtAuthGuard)
  getAllUser() {
    return this.userService.getAllUser();
  }

  @Get('byId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

}
