import axios from 'axios'

// 백엔드 서버 기본 URL
const BASE_URL = 'http://localhost:3000'

// 새 습관 생성
export async function createHabit(name: string) {
  const response = await axios.post(`${BASE_URL}/habits`, { name })
  return response.data
}

// 모든 습관 가져오기
export async function getHabits() {
  const response = await axios.get(`${BASE_URL}/habits`)
  return response.data
}

// 특정 habit 로그 가져오기
export async function getHabitLogs(habitId: number) {
  const response = await axios.get(`${BASE_URL}/habit-logs/${habitId}`)
  return response.data
}

// habit 로그 생성
export async function createHabitLog(habitId: number, date: string, completed = false) {
  const response = await axios.post(`${BASE_URL}/habit-logs`, { habitId, date, completed })
  return response.data
}

// habit 로그 업데이트
export async function updateHabitLog(id: number, completed: boolean) {
  const response = await axios.patch(`${BASE_URL}/habit-logs/${id}`, { completed })
  return response.data
}
