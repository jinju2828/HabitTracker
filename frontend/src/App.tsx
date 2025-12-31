import React, { useEffect, useState } from "react";
import { HabitForm } from "./components/HabitForm";
import { HabitCard } from "./components/HabitCard";
import { HabitProgressChart } from "./components/HabitProgressChart";
import { useHabits } from "./hooks/useHabits";
import { useAllHabitLogs } from "./hooks/useAllHabitLogs";
import { getHabitLogs, createHabitLog, updateHabitLog } from "@/api/habitLogsApi";
import TotalHabitProgressChart from "./components/TotalHabitProgressChart";
import { DailyGoal } from "./components/DailyGoal";

function App() {
  const { habits } = useHabits();
  const { allLogs, loading, refetch: refetchAllLogs } = useAllHabitLogs();

  console.log('habits:', habits.length);
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);

  // 유저 로컬 기준 오늘 날짜 (YYYY-MM-DD)
  const todayLocal = (() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  // 오늘 로그 초기값 세팅
  useEffect(() => {
    const initChecked = async () => {
      const map: Record<number, boolean> = {};
      for (const habit of habits) {
        // const logs = await getHabitLogs(habit.id);

        let logs: any[] = [];

        try {
          logs = await getHabitLogs(habit.id);
        } catch (err: any) {
          if (err.response?.status !== 404) {
            throw err; // 진짜 에러만 throw
          }
          // 404면 logs = []
        }

        const todayLog = logs.find((l) => {
          const logDate = new Date(l.log_date);
          const logY = logDate.getFullYear();
          const logM = String(logDate.getMonth() + 1).padStart(2, "0");
          const logD = String(logDate.getDate()).padStart(2, "0");
          return `${logY}-${logM}-${logD}` === todayLocal;
        });
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
        // const logs = await getHabitLogs(habit.id);
        let logs: any[] = [];

        try {
          logs = await getHabitLogs(habit.id);
        } catch (err: any) {
          if (err.response?.status !== 404) {
            throw err; // 진짜 에러만 throw
          }
          // 404면 logs = []
        }

        const todayLog = logs.find((l) => {
          const logDate = new Date(l.log_date);
          const logY = logDate.getFullYear();
          const logM = String(logDate.getMonth() + 1).padStart(2, "0");
          const logD = String(logDate.getDate()).padStart(2, "0");

          // console.log("Comparing log date:", `${logY}-${logM}-${logD}`, "with todayLocal:", todayLocal);
          return `${logY}-${logM}-${logD}` === todayLocal;
        });

        if (todayLog) {
          await updateHabitLog(todayLog.id, checkedMap[habit.id]);
        } else {
          await createHabitLog(habit.id, new Date().toISOString(), checkedMap[habit.id]);
        }
      }
      // 모든 로그 새로 fetch해서 차트 바로 업데이트
      await refetchAllLogs?.();
    } catch (err) {
      console.error("Save all error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
  <div style={{ padding: "20px" }}>
    {/* 전체 컨테이너 (차트용 wide) */}
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* 🔹 상단 좁은 영역 */}
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
        }}
      >
        <h1 style={{ textAlign: "center" }}>🌿 Habit Tracker</h1>
        {habits.length > 0 && <h3>You have total {habits.length} habits!</h3>}
        {habits.length === 0 && <h3>No habits yet. Start by adding one below!</h3>}

        <DailyGoal />
        <HabitForm />

        <h2 style={{ marginTop: 20, textAlign: "center" }}>Today's Habits</h2>
        <h3> Mark as Done! </h3>
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
            width: "100%", // 🔥 버튼도 깔끔
          }}
        >
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {/* 🔹 차트 영역 (wide) */}
      <h2 style={{ marginTop: 40, textAlign: "center" }}>Each Habit Progress</h2>
      <HabitProgressChart refreshKey={allLogs} />

      <h2 style={{ marginTop: 40, textAlign: "center" }}>Total Habit Activity Overview</h2>
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
        }}
      > 
        {loading ? <p>Loading heatmap...</p> : <TotalHabitProgressChart allLogs={allLogs} />}
      </div>
    </div>
  </div>
);

}

export default App;
