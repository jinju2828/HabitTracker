import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
import { HabitLogsModule } from './habit-logs/habit-logs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [HabitsModule, HabitLogsModule, AuthModule, UsersModule],
})
export class AppModule {}
