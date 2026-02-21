// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth') // ✅ 여기서 'auth' 라우트 등록
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // ✅ register 엔드포인트
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body.email, body.password);
  }
}