import React from 'react';
import { useHabitLogs } from '@/hooks/useHabitLogs';

interface HabitCardProps {
  id: number;
  name: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({ id, name }) => {
  const { logs, toggleLog } = useHabitLogs(id);

  const todayLog = logs.find(
    (log) => new Date(log.log_date).toDateString() === new Date().toDateString()
  );

  const handleToggle = () => {
    if (todayLog) {
      toggleLog(todayLog.id, !todayLog.completed);
    } else {
      // 오늘 로그 없으면 생성
      toggleLog(0, true); // 나중에 createHabitLog로 바꿀 수도 있음
    }
  };

  return (
    <div style={{ border: '1px solid gray', padding: '8px', marginBottom: '8px' }}>
      <h3>{name}</h3>
      <label>
        <input
          type="checkbox"
          checked={todayLog?.completed || false}
          onChange={handleToggle}
        />
        Done today
      </label>
    </div>
  );
};
