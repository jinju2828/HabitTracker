import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { db } from '../db/kysely.provider';

@Injectable()
export class AuthService {
  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await db
      .insertInto('users')
      .values({ email, password: hashed })
      .returningAll()
      .executeTakeFirst();

    return { id: user?.id, email: user?.email };
  }

  async login(email: string, password: string) {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password');

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret', // 나중에 .env로 관리
      { expiresIn: '7d' }
    );

    return { token };
  }
}