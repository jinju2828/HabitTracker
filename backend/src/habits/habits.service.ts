import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/kysely.provider';
import dayjs from 'dayjs';

@Injectable()
export class HabitsService {
  async getAll(userId: number) {
    return db
      .selectFrom('habits')
      .selectAll()
      .where('user_id', '=', userId) // 유저별 필터
      .orderBy('id')
      .execute();
  }

  async create(name: string, userId: number) {
    await db
      .insertInto('habits')
      .values({
        name,
        user_id: userId,              // 필수
        created_at: dayjs().toISOString(), // string으로 변환
      })
      .execute();

    return { message: `Habit "${name}" added!` };
  }

  async update(id: number, name: string) {
    const result = await db
      .updateTable('habits')
      .set({ name })
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result || Number(result.numUpdatedRows) === 0) {
      throw new NotFoundException(`Habit ${id} not found`);
    }

    return { message: `Habit ${id} updated` };
  }

  async delete(id: number) {
    const result = await db
      .deleteFrom('habits')
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result || Number(result.numDeletedRows) === 0) {
      throw new NotFoundException(`Habit ${id} not found`);
    }

    return { message: `Habit ${id} deleted` };
  }
}