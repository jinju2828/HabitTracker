import axios from "axios";
import { useEffect, useState } from "react";
import type { HabitLog } from "@/utils/types";

// ✅ Hook에서 쓸 수 있는 fetch 함수 따로 분리
export const fetchHabitLogs = async (habitId: number): Promise<HabitLog[]> => {
  const res = await axios.get(`/api/habits/${habitId}/logs`);
  return res.data;
};

// ✅ 개별 habit 로그 가져오기
export const useHabitLogs = (habitId: number) => {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const data = await fetchHabitLogs(habitId);
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
