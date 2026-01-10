// src/context/DailyGoalContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

interface DailyGoalContextType {
  dailyGoal: number;
  setDailyGoal: (n: number) => void;
}

const DailyGoalContext = createContext<DailyGoalContextType | null>(null);

const STORAGE_KEY = "dailyGoal";

export function DailyGoalProvider({ children }: { children: React.ReactNode }) {
  // ✅ 초기값을 localStorage에서 읽기
  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : 5;
  });

  // ✅ 값이 바뀔 때마다 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(dailyGoal));
  }, [dailyGoal]);

  return (
    <DailyGoalContext.Provider value={{ dailyGoal, setDailyGoal }}>
      {children}
    </DailyGoalContext.Provider>
  );
}

export function useDailyGoal() {
  const ctx = useContext(DailyGoalContext);
  if (!ctx) {
    throw new Error("useDailyGoal must be used inside DailyGoalProvider");
  }
  return ctx;
}
