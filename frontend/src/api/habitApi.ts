import axios from 'axios'

export const BASE_URL = 'http://localhost:3000'

// 토큰 가져오기
function getAuthHeader() {
  const token = localStorage.getItem('access_token')
  return { Authorization: `Bearer ${token}` }
}

// 새 습관 생성
export async function createHabit(data: { name: string }) {
  const response = await axios.post(`${BASE_URL}/habits`, data, {
    headers: getAuthHeader()
  })
  return response.data
}

export async function updateHabit(id: number, name: string) {
  const response = await axios.patch(`${BASE_URL}/habits/${id}`, { name }, {
    headers: getAuthHeader()
  })
  return response.data
}

export async function deleteHabit(id: number) {
  const response = await axios.delete(`${BASE_URL}/habits/${id}`, {
    headers: getAuthHeader()
  })
  return response.data
}

export async function getHabits() {
  const response = await axios.get(`${BASE_URL}/habits`, {
    headers: getAuthHeader()
  })
  return response.data
}

export async function getHabitLogs(habitId: number) {
  const response = await axios.get(`${BASE_URL}/habit-logs/${habitId}`, {
    headers: getAuthHeader()
  })
  return response.data
}

export async function createHabitLog(habitId: number, date: string, completed = false) {
  const response = await axios.post(`${BASE_URL}/habit-logs`, { habitId, date, completed }, {
    headers: getAuthHeader()
  })
  return response.data
}

export async function updateHabitLog(id: number, completed: boolean) {
  const response = await axios.patch(`${BASE_URL}/habit-logs/${id}`, { completed }, {
    headers: getAuthHeader()
  })
  return response.data
}