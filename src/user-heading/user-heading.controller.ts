import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserHeadingService } from './user-heading.service';
import { CreateUserHeadingDto } from './dto/create-user-heading.dto';
import { UpdateUserHeadingDto } from './dto/update-user-heading.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user-heading')
export class UserHeadingController {
  constructor(private readonly userHeadingService: UserHeadingService) { }

  @Post('create')
  createUserHeading(@Body() createUserHeadingDto: CreateUserHeadingDto) {
    return this.userHeadingService.createUserHeading(createUserHeadingDto);
  }

  @Get('getAll')
  // @UseGuards(JwtAuthGuard)
  getAllUserHeading() {
    return this.userHeadingService.getAllUserHeading();
  }

  @Get('byId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getUserHeadingById(@Param('id') id: string) {
    return this.userHeadingService.getUserHeadingById(+id);
  }

  @Get('byUserId/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  // @Roles('admin')
  getUserHeadingByUserId(@Param('id') id: string) {
    return this.userHeadingService.getUserHeadingByUserId(+id);
  }


  @Patch('delete/:id')
  // @UseGuards(JwtAuthGuard)
  deleteUserHeading(@Param('id') id: string) {
    return this.userHeadingService.deleteUserHeading(+id);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  updateUserHeading(@Body() updateUserHeadingDto: UpdateUserHeadingDto) {
    return this.userHeadingService.updateUserHeading(updateUserHeadingDto);
  }
}
