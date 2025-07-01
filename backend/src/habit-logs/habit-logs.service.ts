import { Injectable } from '@nestjs/common';
import { db } from '../db/kysely.provider';

@Injectable()
export class HabitLogsService {
  // 특정 habit의 모든 로그 조회
  async getLogsByHabit(habitId: number) {
    return await db.selectFrom('habit_logs')
      .selectAll()
      .where('habit_id', '=', habitId)
      .orderBy('log_date')
      .execute();
  }

  // 새 로그 추가
  async createLog(habitId: number, date: string, completed = false) {
    await db.insertInto('habit_logs').values({
      habit_id: habitId,
      log_date: date,
      completed,
    }).execute();

    return { message: `Log for habit ${habitId} on ${date} added!` };
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
