import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService, LoginDto, RegisterDto } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: unknown) {
    // Manual Zod validation for now, or rely on pipe if set up with DTOs
    const input = LoginDto.parse(body);
    return this.authService.login(input);
  }

  @Post('register')
  async register(@Body() body: unknown) {
    const input = RegisterDto.parse(body);
    return this.authService.register(input);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
