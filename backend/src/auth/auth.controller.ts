import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вхід в систему' })
  @ApiResponse({ status: 200, description: 'Успішний вхід' })
  @ApiResponse({ status: 401, description: 'Невірні облікові дані' })
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Невірні облікові дані');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  @ApiResponse({ status: 201, description: 'Користувача успішно зареєстровано' })
  @ApiResponse({ status: 400, description: 'Некоректні дані' })
  async register(@Body() registerDto: { 
    email: string; 
    password: string; 
    firstName?: string; 
    lastName?: string; 
  }) {
    return this.authService.register(registerDto);
  }
}
