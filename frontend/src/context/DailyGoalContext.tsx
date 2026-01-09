// Context for managing daily goal state
import { createContext, useContext, useState } from "react";

interface DailyGoalContextType {
  dailyGoal: number;
  setDailyGoal: (n: number) => void;
}

const DailyGoalContext = createContext<DailyGoalContextType | null>(null);

export function DailyGoalProvider({ children }: { children: React.ReactNode }) {
  const [dailyGoal, setDailyGoal] = useState(5);

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
