import axios from 'axios';
import { BASE_URL } from './habitApi';

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
  const res = await axios.get(`${BASE_URL}/habits`);
  return res.data;
};

// 특정 습관 로그 조회
export const getHabitLogs = async (habitId: number): Promise<HabitLog[]> => {
  const res = await axios.get(`${BASE_URL}/habit-logs/${habitId}`);
  return res.data;
};
