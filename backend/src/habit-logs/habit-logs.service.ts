import { Injectable } from '@nestjs/common';
import { db } from '../db/kysely.provider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class HabitLogsService {
  // 특정 habit의 모든 로그 조회
  async getLogsByHabit(habitId: number, userId: number) {
    return await db
      .selectFrom('habit_logs')
      .selectAll()
      .where('habit_id', '=', habitId)
      .where('user_id', '=', userId) // 유저별 필터
      .orderBy('log_date')
      .execute();
  }

  async createLog(
    habitId: number,
    userId: number,
    date?: string,
    completed = false,
  ) {
    const logDate = date
      ? date // 🔥 그대로 사용 (절대 변환 금지)
      : dayjs().utc().format('YYYY-MM-DD');

    const existing = await db
      .selectFrom('habit_logs')
      .select(['id'])
      .where('habit_id', '=', habitId)
      .where('user_id', '=', userId)
      .where('log_date', '=', logDate)
      .executeTakeFirst();

    if (existing) {
      await db
        .updateTable('habit_logs')
        .set({ completed })
        .where('id', '=', existing.id)
        .execute();

      return { message: `updated` };
    }

    await db
      .insertInto('habit_logs')
      .values({
        habit_id: habitId,
        user_id: userId,
        log_date: logDate,
        completed,
      })
      .execute();

    return { message: `created` };
  }

  // 로그 업데이트 (체크 상태 변경)
  async updateLog(id: number, completed: boolean) {
    await db.updateTable('habit_logs')
      .set({ completed })
      .where('id', '=', id)
      .execute();

    return { message: `Log ${id} updated to ${completed}` };
  }
}