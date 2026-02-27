import axios from 'axios';

const BASE_URL = 'http://localhost:3000/habit-logs';

// 🔐 axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// 🔐 요청마다 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 토큰 만료 -> 자동 로그아웃 처리
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export interface HabitLog {
  id: number;
  habit_id: number;
  log_date: string;
  completed: boolean;
}

// 특정 habit의 로그 가져오기
export const getHabitLogs = async (habitId: number): Promise<HabitLog[]> => {
  const res = await api.get(`/habit-logs/${habitId}`);
  return res.data;
};

// 로그 생성
export const createHabitLog = async (
  habitId: number,
  date: string,
  completed = false
) => {
  const res = await api.post(`/habit-logs`, {
    habitId,
    date,
    completed,
  });
  return res.data;
};

// 로그 업데이트
export const updateHabitLog = async (
  id: number,
  completed: boolean
) => {
  const res = await api.patch(`/habit-logs/${id}`, {
    completed,
  });


  return res.data;
};