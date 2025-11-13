import React from "react";
import { HabitForm } from "./components/HabitForm";
import { HabitCard } from "./components/HabitCard";
import { HabitProgressChart } from "./components/HabitProgressChart";
import { TotalHeatmap } from "./components/charts/TotalHeatmap";
import { useHabits } from "./hooks/useHabits";
import { useAllHabitLogs } from "./hooks/useAllHabitLogs";

function App() {
  const { habits } = useHabits();
  const { allLogs, loading } = useAllHabitLogs();
  console.log("🔥 TotalHeatmap input", allLogs);
  return (
    <div style={{ padding: "20px" }}>
      <h1>🌿 Habit Tracker</h1>

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
        <TotalHeatmap allLogs={allLogs} />
      )}
    </div>
  );
}

export default App;
