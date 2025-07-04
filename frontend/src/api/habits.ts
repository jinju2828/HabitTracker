import axios from 'axios';

const API_BASE = 'http://localhost:3000'; // 백엔드 URL

export interface Habit {
  id: number;
  name: string;
  created_at: string;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  log_date: string; // ISO string
  completed: boolean;
}

// 모든 습관 조회
export const getHabits = async (): Promise<Habit[]> => {
  const res = await axios.get(`${API_BASE}/habits`);
  return res.data;
};

// 특정 습관 로그 조회
export const getHabitLogs = async (habitId: number): Promise<HabitLog[]> => {
  const res = await axios.get(`${API_BASE}/habit-logs/${habitId}`);
  return res.data;
};
