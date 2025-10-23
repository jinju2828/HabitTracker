import axios from 'axios';

const BASE_URL = 'http://localhost:3000/habit-logs';

export interface HabitLog {
  id: number;
  habit_id: number;
  log_date: string;
  completed: boolean;
}

// 특정 habit의 로그 가져오기
export const getHabitLogs = async (habitId: number): Promise<HabitLog[]> => {
  const res = await axios.get(`${BASE_URL}/${habitId}`);
  return res.data;
};

// 로그 생성
export const createHabitLog = async (habitId: number, date: string, completed = false) => {
  const res = await axios.post(BASE_URL, { habitId, date, completed });
  return res.data;
};

// 로그 업데이트
export const updateHabitLog = async (id: number, completed: boolean) => {
  const res = await axios.patch(`${BASE_URL}/${id}`, { completed });
  return res.data;
};
