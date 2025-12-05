import React from "react";
import { HabitForm } from "./components/HabitForm";
import { HabitCard } from "./components/HabitCard";
import { HabitProgressChart } from "./components/HabitProgressChart";
import { useHabits } from "./hooks/useHabits";
import { useAllHabitLogs } from "./hooks/useAllHabitLogs";
import TotalHabitProgressChart from "./components/TotalHabitProgressChart";

function App() {
  const { habits } = useHabits();
  const { allLogs, loading } = useAllHabitLogs();

  const localNow = new Date(); // Local time

  // 정확한 UTC Date 객체 생성
  const utcNow = new Date(
    Date.now() + localNow.getTimezoneOffset() * 60000
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌿 Habit Tracker</h1>

      {/* 🔥 시스템 날짜 표시 */}
      <div>
        <strong>TODAY: </strong> {localNow.toDateString()} <br />
        <div style={{ 
          marginBottom: "20px", 
          padding: "10px 14px",
          background: "#f3f4f6",
          borderRadius: 8 ,
          color: "#333"
        }}>
          <div><strong>🕒 Local Time:</strong> {localNow.toString()}</div>
          <div><strong>🌍 UTC Time:</strong> {utcNow.toUTCString()}</div>

          <div><strong>📅 Local Date:</strong> {localNow.toISOString().slice(0, 10)}</div>
          <div><strong>📅 UTC Date:</strong> {utcNow.toISOString().slice(0, 10)}</div>

        </div>
      </div>

      <HabitForm />

      <h2 style={{ marginTop: 20 }}>Today's Habits</h2>
      {habits.map((habit) => (
        <HabitCard key={habit.id} id={habit.id} name={habit.name} />
      ))}

      <h2 style={{ marginTop: 30 }}>Each Habit Progress</h2>
      <HabitProgressChart />

      <h2>Total Habit Activity Overview</h2>
      {loading ? (
        <p>Loading heatmap...</p>
      ) : (
        <TotalHabitProgressChart allLogs={allLogs} />
      )}
    </div>
  );
}

export default App;
