import { useState } from 'react'
import { createHabit } from '@/api/habitApi' // axios로 POST 호출

type Props = {
  onHabitCreated: () => void // 새 습관 생성 후 목록 갱신 콜백
}

export function HabitForm({ onHabitCreated }: Props) {
  const [habitName, setHabitName] = useState('') // 입력 상태 관리
  const [loading, setLoading] = useState(false) // 요청 중 로딩 상태
  const [error, setError] = useState('') // 에러 메시지 상태

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!habitName.trim()) return // 빈 값 방지
    setLoading(true)
    setError('')

    try {
      await createHabit(habitName) // 백엔드 POST 호출
      setHabitName('') // 폼 초기화
      onHabitCreated() // 부모에게 갱신 알림
    } catch (err: any) {
      setError(err.message || '습관 생성 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        placeholder="새 습관 이름"
      />
      <button type="submit" disabled={loading}>
        {loading ? '추가 중...' : '추가'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
