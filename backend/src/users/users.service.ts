import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/kysely.provider';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  async getProfile(userId: number) {
    const user = await db
      .selectFrom('users')
      .select([
        'id',
        'email',
        'display_name',
        'daily_goal',
        'avatar',
      ])
      .where('id', '=', userId)
      .executeTakeFirst();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      display_name: user.display_name ?? null,
      // 기본 1: 해빗 개수보다 큰 목표로 시작하지 않도록 (프론트에서 필요 시 조정)
      daily_goal: user.daily_goal ?? 1,
      avatar: user.avatar ?? null,
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const patch: Record<string, string | number | null> = {};
    if (dto.display_name !== undefined) {
      patch.display_name = dto.display_name;
    }
    if (dto.daily_goal !== undefined) {
      patch.daily_goal = dto.daily_goal;
    }
    if (dto.avatar !== undefined) {
      patch.avatar = dto.avatar;
    }

    if (Object.keys(patch).length > 0) {
      await db
        .updateTable('users')
        .set(patch as any)
        .where('id', '=', userId)
        .execute();
    }

    return this.getProfile(userId);
  }
}
