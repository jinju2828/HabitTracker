import { useEffect, useState } from "react";
import type { HabitLog } from "@/utils/types";
import { getHabitLogs } from "@/api/habitLogsApi"; // 🔥 이걸 사용

// ✅ Hook에서 쓸 수 있는 fetch 함수
export const fetchHabitLogs = async (
  habitId: number
): Promise<HabitLog[]> => {
  return await getHabitLogs(habitId); // 🔥 axios 직접 호출 금지
};

// ✅ 개별 habit 로그 가져오기
export const useHabitLogs = (habitId: number) => {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const data = await getHabitLogs(habitId); // 🔥 여기 수정
        setLogs(data);
      } catch (err) {
        console.error("Failed to load habit logs", err);
      } finally {
        setLoading(false);
      }
    };

    if (habitId) loadLogs();
  }, [habitId]);

  return { logs, loading };
};