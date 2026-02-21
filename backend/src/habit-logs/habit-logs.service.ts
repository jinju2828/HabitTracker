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

  // 새 로그 추가
  async createLog(
    habitId: number,
    userId: number,          // 필수로 userId 추가
    date?: string,
    completed = false,
    userTimezone?: string,
  ) {
    const logDate = date
      ? dayjs(date).format('YYYY-MM-DD')
      : dayjs().tz(userTimezone || 'UTC').format('YYYY-MM-DD');

    await db.insertInto('habit_logs').values({
      habit_id: habitId,
      user_id: userId,       // 필수
      log_date: logDate,
      completed,
    }).execute();

    return { message: `Log for habit ${habitId} on ${logDate} added!` };
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