import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfirmUserDto } from './dto/confirm-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }
  
  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Request() req) {
    return this.authService.logout(req);
  }

  @Patch('confirm')
  confirmUser(@Body() confirmUserDto: ConfirmUserDto) {
    return this.userService.confirmUser(confirmUserDto);
  }

  @Get('code-resend/:id')
  codeResend(@Param('id') userId: string) {
    return this.userService.codeResend(+userId);
  }
}
