import { Injectable, NotFoundException } from '@nestjs/common'
import { db } from '../db/kysely.provider'

@Injectable()
export class HabitsService {
  async getAll() {
    // SELECT * FROM habits ORDER BY id ASC
    return db
      .selectFrom('habits')
      .selectAll()
      .orderBy('id')
      .execute()
  }

  async create(name: string) {
    await db
      .insertInto('habits')
      .values({
        name,
        created_at: new Date(),
      })
      .execute()

    return { message: `Habit "${name}" added!` }
  }

  // ✏️ habit 이름 수정
  async update(id: number, name: string) {
    const result = await db
      .updateTable('habits')
      .set({ name })
      .where('id', '=', id)
      .executeTakeFirst()

    if (!result || Number(result.numUpdatedRows) === 0) {
      throw new NotFoundException(`Habit ${id} not found`)
    }

    return { message: `Habit ${id} updated` }
  }

  // 🗑 habit 삭제
  async delete(id: number) {
    const result = await db
      .deleteFrom('habits')
      .where('id', '=', id)
      .executeTakeFirst()

    if (!result || Number(result.numDeletedRows) === 0) {
      throw new NotFoundException(`Habit ${id} not found`)
    }

    return { message: `Habit ${id} deleted` }
  }
}
