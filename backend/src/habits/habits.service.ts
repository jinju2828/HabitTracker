import { Injectable } from '@nestjs/common';
import { db } from '../db/kysely.provider';

@Injectable()
export class HabitsService {
  async getAll() {
    // SELECT * FROM habits ORDER BY id ASC
    const habits = await db.selectFrom('habits')
      .selectAll()
      .orderBy('id')
      .execute();
    return habits;
  }

  async create(name: string) {
    // INSERT INTO habits (name, created_at) VALUES (...)
    await db.insertInto('habits').values({
      name,
      created_at: new Date(),
    }).execute();

    return { message: `Habit "${name}" added!` };
  }
}
