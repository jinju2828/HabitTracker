// 각 습관의 체크(완료/미완료) UI, DB 반영 담당

import React, { useEffect, useState } from 'react';
import { getHabitLogs, createHabitLog, updateHabitLog } from '@/api/habitLogsApi';

interface HabitCardProps {
  id: number;
  name: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({ id, name }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [todayLogId, setTodayLogId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    getHabitLogs(id)
      .then((res) => {
        const todayLog = res.find((log) => log.log_date.startsWith(today));
        if (todayLog) setIsCompleted(todayLog.completed);
      })
      .catch((err) => console.error(err));
  }, [id]);

  
  // 오늘 로그 가져와서 상태 설정
  const loadToday = async () => {
    try {
      const logs = await getHabitLogs(id);
      // normalize: log_date may be "2025-10-08T07:00:00.000Z" -> slice(0,10)
      const todayLog = logs.find((l) => l.log_date.slice(0, 10) === today);
      if (todayLog) {
        setIsCompleted(Boolean(todayLog.completed));
        setTodayLogId(todayLog.id);
      } else {
        setIsCompleted(false);
        setTodayLogId(null);
      }
    } catch (err) {
      console.error('loadToday error', err);
    }
  };

  useEffect(() => {
    loadToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  
  const toggle = async () => {
    setLoading(true);
    try {
      if (todayLogId) {
        // 이미 있을 때 -> update
        await updateHabitLog(todayLogId, !isCompleted);
        setIsCompleted((v) => !v);
      } else {
        // 없으면 생성 (완료=true)
        await createHabitLog(id, today, true);
        // 생성 직후 다시 로드해서 id 확보
        await loadToday();
      }
    } catch (err) {
      console.error('toggle error', err);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div style={{
      border: '1px solid #ddd', padding: 12, borderRadius: 6, marginBottom: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div>{name}</div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={isCompleted} onChange={toggle} disabled={loading} />
        <span>{isCompleted ? 'Done' : 'Mark'}</span>
      </label>
    </div>
  );
  
};
