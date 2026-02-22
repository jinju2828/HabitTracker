// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { db } from '../db/kysely.provider';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // JWT 서비스 추가 필요

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {} // 생성자에 JwtService 주입

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db
      .insertInto('users')
      .values({ email, password: hashedPassword })
      .returningAll()
      .executeTakeFirst();

    return { id: result?.id, email: result?.email };
  }

  // ✅ 로그인 함수
  async login(email: string, password: string) {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // JWT 발급
    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}