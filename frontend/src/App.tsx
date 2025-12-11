import React, { useState, useEffect } from "react";
import { HabitForm } from "./components/HabitForm";
import { HabitCard } from "./components/HabitCard";
import { HabitProgressChart } from "./components/HabitProgressChart";
import { useHabits } from "./hooks/useHabits";
import { useAllHabitLogs } from "./hooks/useAllHabitLogs";
import TotalHabitProgressChart from "./components/TotalHabitProgressChart";
import { createHabitLog, updateHabitLog, getHabitLogs } from "@/api/habitLogsApi";

function App() {
  const { habits, fetchHabits } = useHabits();
  const { allLogs, loading, refetch: refetchAllLogs } = useAllHabitLogs();

  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({});

  // 초기값 세팅: 오늘 로그 기준
  useEffect(() => {
    async function loadTodayLogs() {
      const map: Record<number, boolean> = {};
      for (const habit of habits) {
        const logs = await getHabitLogs(habit.id);
        const todayLog = logs.find(l => l.log_date.slice(0, 10) === new Date().toISOString().slice(0,10));
        map[habit.id] = todayLog ? todayLog.completed : false;
      }
      setCompletedMap(map);
    }
    if (habits.length) loadTodayLogs();
  }, [habits]);

  const handleChange = (id: number, completed: boolean) => {
    setCompletedMap(prev => ({ ...prev, [id]: completed }));
  };

  const saveAll = async () => {
    for (const habitIdStr in completedMap) {
      const habitId = Number(habitIdStr);
      const completed = completedMap[habitId];
      const logs = await getHabitLogs(habitId);
      const todayLog = logs.find(l => l.log_date.slice(0,10) === new Date().toISOString().slice(0,10));

      if (todayLog) {
        await updateHabitLog(todayLog.id, completed);
      } else {
        await createHabitLog(habitId, new Date().toISOString(), completed);
      }
    }

    fetchHabits();      // 습관 리스트 갱신
    refetchAllLogs();   // 모든 로그 갱신
    alert("Saved!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌿 Habit Tracker</h1>

      <HabitForm />

      <h2 style={{ marginTop: 20 }}>Today's Habits</h2>
      {habits.map(h => (
        <HabitCard
          key={h.id}
          id={h.id}
          name={h.name}
          completed={completedMap[h.id] ?? false}
          onChange={handleChange}
        />
      ))}

      <button
        onClick={saveAll}
        style={{
          marginTop: 12,
          padding: "8px 16px",
          background: "#4f46e5",
          color: "white",
          borderRadius: 4,
        }}
      >
        Save All
      </button>

      <h2 style={{ marginTop: 30 }}>Each Habit Progress</h2>
      <HabitProgressChart />

      <h2>Total Habit Activity Overview</h2>
      {loading ? <p>Loading heatmap...</p> : <TotalHabitProgressChart allLogs={allLogs} />}
    </div>
  );
}

export default App;
