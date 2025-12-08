import React, { useEffect, useState } from 'react';
import { getHabitLogs, createHabitLog, updateHabitLog } from '@/api/habitLogsApi';

interface HabitCardProps {
  id: number;
  name: string;
}

// 사용자 로컬 날짜(YYYY-MM-DD)를 만드는 함수
const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const HabitCard: React.FC<HabitCardProps> = ({ id, name }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [todayLogId, setTodayLogId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const todayLocal = getLocalDateString(); // 사용자 기준의 오늘 날짜(YYYY-MM-DD)

  // 오늘 로그 로드
  const loadToday = async () => {
    try {
      const logs = await getHabitLogs(id);

      // UTC ISO 날짜를 로컬 날짜로 비교
      const todayLog = logs.find(
        (l) => l.log_date.slice(0, 10) === todayLocal
      );

      if (todayLog) {
        setIsCompleted(Boolean(todayLog.completed));
        setTodayLogId(todayLog.id);
      } else {
        setIsCompleted(false);
        setTodayLogId(null);
      }
    } catch (err) {
      console.error("loadToday error", err);
    }
  };

  useEffect(() => {
    loadToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggle = async () => {
    setLoading(true);
    try {
      const utcDateString = new Date().toISOString(); 
      // 예: 2025-12-06T22:00:00.000Z (UTC 기준으로 백엔드 저장)

      if (todayLogId) {
        // 이미 있을 때 -> update
        await updateHabitLog(todayLogId, !isCompleted);
        setIsCompleted((v) => !v);
      } else {
        // 없으면 생성 (완료=true)
        await createHabitLog(id, utcDateString, true);
        await loadToday(); // 새로 생성된 로그 id 가져오기
      }
    } catch (err) {
      console.error("toggle error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>{name}</div>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={toggle}
          disabled={loading}
        />
        <span>{isCompleted ? "Done" : "Mark"}</span>
      </label>
    </div>
  );
};
