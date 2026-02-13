import React from "react";
import { DailyGoalProvider } from "./context/DailyGoalContext";
import { useAllHabitLogs } from "./hooks/useAllHabitLogs";
import HabitManager from "./components/HabitManager";
import DailyGoal from "./components/DailyGoal";
import { HabitProgressChart } from "./components/HabitProgressChart";
import TotalHabitProgressChart from "./components/TotalHabitProgressChart";

function App() {
  const { allLogs, loading, refetch } = useAllHabitLogs();

  return (
    <DailyGoalProvider>
      <div style={{ padding: 20 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ textAlign: "center" }}>🌿 Habit Tracker</h1>

          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <DailyGoal allLogs={allLogs} />

            <HabitManager
              allLogs={allLogs}
              refetchLogs={refetch}
            />
          </div>

          <h2 style={{ marginTop: 40, textAlign: "center" }}>
            Each Habit Progress
          </h2>
          <HabitProgressChart refreshKey={allLogs} />

          <h2 style={{ marginTop: 40, textAlign: "center" }}>
            Total Habit Activity Overview
          </h2>

          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            {loading ? (
              <p>Loading heatmap...</p>
            ) : (
              <TotalHabitProgressChart allLogs={allLogs} />
            )}
          </div>
        </div>
      </div>
    </DailyGoalProvider>
  );
}

export default App;
