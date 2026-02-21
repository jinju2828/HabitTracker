// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController], // ✅ 반드시 등록
  providers: [AuthService],
})
export class AuthModule {}