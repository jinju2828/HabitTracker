import { Module } from '@nestjs/common';
// import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
// import { HabitLogsModule } from './habit-logs/habit-logs.module';

@Module({
//   imports: [UsersModule, AuthModule, HabitsModule, HabitLogsModule],
  imports: [HabitsModule],

})
export class AppModule {}
