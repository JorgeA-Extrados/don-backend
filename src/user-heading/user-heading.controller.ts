import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserHeadingService } from './user-heading.service';
import { CreateUserHeadingDto } from './dto/create-user-heading.dto';
import { UpdateUserHeadingDto } from './dto/update-user-heading.dto';

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

  @Patch('update/:id')
  // @UseGuards(JwtAuthGuard)
  updateUserHeading(@Param('id') id: string, @Body() updateUserHeadingDto: UpdateUserHeadingDto) {
    return this.userHeadingService.updateUserHeading(+id, updateUserHeadingDto);
  }
}
