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

  // 메뉴 밖 클릭 시 닫기
  useEffect(() => {
    const handleClick = () => setMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
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

              {/* HEADER */}
              <div className="header">
                <h1 className="title">🌿 Habit Tracker</h1>

                <div
                  className={`hamburger ${menuOpen ? "open" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(!menuOpen);
                  }}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                {menuOpen && (
                  <div
                    className="menu-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="menu-item">Contact</button>
                    <button
                      className="menu-item logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <div className="content-small">
                <DailyGoal allLogs={allLogs} />

                <HabitManager
                  allLogs={allLogs}
                  refetchLogs={refetch}
                />
              </div>

              <h2 className="section-title">
                Each Habit Progress
              </h2>

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