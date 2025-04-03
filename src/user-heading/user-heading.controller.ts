import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserHeadingService } from './user-heading.service';
import { CreateUserHeadingDto } from './dto/create-user-heading.dto';
import { UpdateUserHeadingDto } from './dto/update-user-heading.dto';

@Controller('user-heading')
export class UserHeadingController {
  constructor(private readonly userHeadingService: UserHeadingService) {}

  @Post()
  create(@Body() createUserHeadingDto: CreateUserHeadingDto) {
    return this.userHeadingService.create(createUserHeadingDto);
  }

  @Get()
  findAll() {
    return this.userHeadingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userHeadingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserHeadingDto: UpdateUserHeadingDto) {
    return this.userHeadingService.update(+id, updateUserHeadingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userHeadingService.remove(+id);
  }
}
