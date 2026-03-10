import React, { useEffect, useState } from "react";
import { DailyGoalProvider } from "./context/DailyGoalContext";
import { useAllHabitLogs } from "./hooks/useAllHabitLogs";
import HabitManager from "./components/HabitManager";
import DailyGoal from "./components/DailyGoal";
import { HabitProgressChart } from "./components/HabitProgressChart";
import TotalHabitProgressChart from "./components/TotalHabitProgressChart";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./styles/App.css";

function App() {
  const { allLogs, loading, refetch } = useAllHabitLogs();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("login");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
      refetch();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div className="habit-tracker">
          <DailyGoalProvider>
            <div className="container">

              <div className="header">
                <h1 className="title">🌿 Habit Tracker</h1>

                <div
                  className={`hamburger ${menuOpen ? "open" : ""}`}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              {/* overlay */}
              {menuOpen && (
                <div
                  className="menu-overlay"
                  onClick={() => setMenuOpen(false)}
                />
              )}

              {/* slide menu */}
              <div className={`side-menu ${menuOpen ? "open" : ""}`}>
                <button className="side-item">Contact</button>
                <button className="side-item">About</button>
                <button className="side-item logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>

              <div className="content-small">
                <DailyGoal allLogs={allLogs} />
                <HabitManager allLogs={allLogs} refetchLogs={refetch} />
              </div>

              <h2 className="section-title">Each Habit Progress</h2>
              <HabitProgressChart allLogs={allLogs} />

              <h2 className="section-title">
                Total Habit Activity Overview
              </h2>

              <div className="chart-container">
                {loading ? (
                  <p>Loading heatmap...</p>
                ) : (
                  <TotalHabitProgressChart allLogs={allLogs} />
                )}
              </div>

            </div>
          </DailyGoalProvider>
        </div>
      ) : (
        <>
          {page === "login" && (
            <Login
              onLoginSuccess={() => setIsLoggedIn(true)}
              goToSignup={() => setPage("signup")}
            />
          )}

          {page === "signup" && (
            <Signup
              onSignupSuccess={() => setPage("login")}
              goToLogin={() => setPage("login")}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;