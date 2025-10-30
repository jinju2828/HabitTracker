// types.ts (utils 폴더나 components 폴더 안에 두기)
export interface Habit {
  id: number;
  name: string;
}

export interface HabitLog {
  log_date: string;
  completed: boolean;
}
