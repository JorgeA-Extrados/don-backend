import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAllUserDto } from './dto/all-user.dto';
import { CreateDeletePhysicsDto } from './dto/deletePhysics.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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

  @Patch('delete')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Request() req) {
    return this.userService.deleteUser(req);
  }

  @Delete('deletePhysics')
  // @UseGuards(JwtAuthGuard)
  deleteUserPhysics(@Body() createDeletePhysicsDto: CreateDeletePhysicsDto) {
    return this.userService.deleteUserPhysics(createDeletePhysicsDto);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  updateUser(@Request() req, @Body() createAllUserDto: CreateAllUserDto) {
    return this.userService.updateUser(req, createAllUserDto);
  }

  @Get('invitationCode')
  @UseGuards(JwtAuthGuard)
  getUserInvitationCode(@Request() req) {
    return this.userService.getUserInvitationCode(req);
  }
  // @Patch('updatePerfil/:id')
  // @UseGuards(JwtAuthGuard)
  // updatePerfil(@Param('id') id: string, @Body() createAllUserDto: CreateAllUserDto) {
  //   return this.userService.updatePerfil(+id, createAllUserDto);
  // }

}
