// 각 습관의 체크(완료/미완료) UI, DB 반영 담당

import React, { useEffect, useState } from 'react';
import { getHabitLogs, createHabitLog, updateHabitLog } from '@/api/habitLogsApi';

interface HabitCardProps {
  id: number;
  name: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({ id, name }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    getHabitLogs(id)
      .then((res) => {
        const todayLog = res.find((log) => log.log_date.startsWith(today));
        if (todayLog) setIsCompleted(todayLog.completed);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const toggleCompletion = async () => {
    try {
      const logs = await getHabitLogs(id);
      const todayLog = logs.find((log) => log.log_date.startsWith(today));

      if (todayLog) {
        await updateHabitLog(todayLog.id, !todayLog.completed);
      } else {
        await createHabitLog(id, today, true);
      }

      setIsCompleted(!isCompleted);
    } catch (err) {
      console.error('Error updating habit log:', err);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{name}</span>
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={toggleCompletion}
      />
    </div>
  );
};
