// types.ts (utils 폴더나 components 폴더 안에 두기)
export interface Habit {
  id: number;
  name: string;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  log_date: string;
  completed: boolean;
}

// 차트 전용 타입
export interface ChartPoint {
  date: string;
  completed: 0 | 1;
}

// heatmap용 타입 (Nivo 포맷)
export interface HeatmapRow {
  id: string;
  data: { x: string; y: number }[]; // x: label (e.g. date or weekday), y: value (0/1)
}