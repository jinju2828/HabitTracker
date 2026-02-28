import React, { useEffect, useState } from "react";
import { DailyGoalProvider } from "./context/DailyGoalContext";
import { useAllHabitLogs } from "./hooks/useAllHabitLogs";
import HabitManager from "./components/HabitManager";
import DailyGoal from "./components/DailyGoal";
import { HabitProgressChart } from "./components/HabitProgressChart";
import TotalHabitProgressChart from "./components/TotalHabitProgressChart";
import Login from "./components/Login";

function App() {
  const { allLogs, loading, refetch } = useAllHabitLogs();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 기존 JWT 있으면 로그인 상태로 처리
    const token = localStorage.getItem('access_token');
     if (token) {
      setIsLoggedIn(true);
      refetch(); // JWT 있으면 자동 fetch
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
  };
  
  console.log("App 전체 logs:", allLogs)
  return (
    <div className="App">
      {isLoggedIn ? (
            <DailyGoalProvider>
      <div style={{ padding: 20 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ textAlign: "center" }}>🌿 Habit Tracker</h1>

          <div style={{ textAlign: "right" }}>
            <button onClick={handleLogout}>
              Logout
            </button>
          </div>

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
          <HabitProgressChart allLogs={allLogs} />

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
      ) : (
        <Login onLoginSuccess={() => {
          setIsLoggedIn(true)
          refetch(); 
        }} />
      )}
    </div>
  );
}

export default App;
