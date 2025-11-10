import { useMemo } from 'react';
import { useHabitLogs } from './useHabitLogs';
import { useHabits } from './useHabits';
import type { HabitLog } from '../utils/types';

export const useAllHabitLogs = (): HabitLog[] => {
  const { habits } = useHabits();

  // ✅ 습관별 훅을 렌더 시점에 고정된 순서로 호출
  const habitLogHooks = habits.map((habit) => useHabitLogs(habit.id));

  // ✅ 모든 로그 합치기
  const allLogs = useMemo(() => {
    return habitLogHooks.flatMap(({ logs }) => logs);
  }, [habitLogHooks]);

  return allLogs;
};
