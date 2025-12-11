import React, { useState, useEffect } from "react";
import { HabitForm } from "./components/HabitForm";
import { HabitCard } from "./components/HabitCard";
import { HabitProgressChart } from "./components/HabitProgressChart";
import { useHabits } from "./hooks/useHabits";
import { useAllHabitLogs } from "./hooks/useAllHabitLogs";
import { getHabitLogs, createHabitLog, updateHabitLog } from "@/api/habitLogsApi";
import TotalHabitProgressChart from "./components/TotalHabitProgressChart";

function App() {
  const { habits } = useHabits();
  const { allLogs, loading, refetch: refetchAllLogs } = useAllHabitLogs();

  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);

  const todayLocal = new Date().toISOString().slice(0, 10);

  // 오늘 로그 초기값 세팅
  useEffect(() => {
    const initChecked = async () => {
      const map: Record<number, boolean> = {};
      for (const habit of habits) {
        const logs = await getHabitLogs(habit.id);
        const todayLog = logs.find((l) => l.log_date.slice(0, 10) === todayLocal);
        map[habit.id] = todayLog ? todayLog.completed : false;
      }
      setCheckedMap(map);
    };
    if (habits.length > 0) initChecked();
  }, [habits, todayLocal]);

  // 체크박스 상태 변경
  const handleChange = (id: number, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };

  // Save All 버튼
  const saveAll = async () => {
    setSaving(true);
    try {
      for (const habit of habits) {
        const logs = await getHabitLogs(habit.id);
        const todayLog = logs.find((l) => l.log_date.slice(0, 10) === todayLocal);

        if (todayLog) {
          await updateHabitLog(todayLog.id, checkedMap[habit.id]);
        } else {
          await createHabitLog(habit.id, new Date().toISOString(), checkedMap[habit.id]);
        }
      }
      // 모든 로그 새로 fetch
      await refetchAllLogs?.();
    } catch (err) {
      console.error("Save all error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌿 Habit Tracker</h1>

      <HabitForm />

      <h2 style={{ marginTop: 20 }}>Today's Habits</h2>
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          id={habit.id}
          name={habit.name}
          isCompleted={checkedMap[habit.id] || false}
          onChange={(v) => handleChange(habit.id, v)}
          disabled={saving || loading}
        />
      ))}

      <button
        onClick={saveAll}
        disabled={saving}
        style={{
          marginTop: 12,
          padding: "8px 16px",
          background: "#4f46e5",
          color: "white",
          borderRadius: 6,
        }}
      >
        {saving ? "Saving..." : "Save All"}
      </button>

      <h2 style={{ marginTop: 30 }}>Each Habit Progress</h2>
      <HabitProgressChart />

      <h2>Total Habit Activity Overview</h2>
      {loading ? <p>Loading heatmap...</p> : <TotalHabitProgressChart allLogs={allLogs} />}
    </div>
  );
}

export default App;
