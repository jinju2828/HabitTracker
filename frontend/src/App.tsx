import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { DailyGoalProvider } from "./context/DailyGoalContext";
import { useAllHabitLogs } from "./hooks/useAllHabitLogs";
import HabitManager from "./components/HabitManager";
import DailyGoal from "./components/DailyGoal";
import { HabitProgressChart } from "./components/HabitProgressChart";
import TotalHabitProgressChart from "./components/TotalHabitProgressChart";
import Login from "./components/Login";
import Signup from "./components/Signup";
import About from "./components/About";
import Contact from "./components/Contact";

import "./styles/App.css";
import Profile from "./components/Profile";

function Dashboard({
  allLogs,
  loading,
  refetch,
  handleLogout,
}: any) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    if (savedName) {
      setName(savedName);
    }
  }, []);

  const avatar = localStorage.getItem("avatar") || "🌱";

  const hasLogs = allLogs.length > 0;

  // console.log("allLogs", allLogs);

  return (
    <div className="habit-tracker">
      <DailyGoalProvider>
        <div className="container">

          <div className="header">
            <h1 className="title">🌿 Habit Tracker</h1>
            {name && (
              <h2 style={{ textAlign: "center", paddingTop: 60, fontSize: 20 }}>
                {avatar} Hello {name} 👋
              </h2>
            )}
            <div
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {menuOpen && (
            <div
              className="menu-overlay"
              onClick={() => setMenuOpen(false)}
            />
          )}

          <div className={`side-menu ${menuOpen ? "open" : ""}`}>
            <button
              className="side-item"
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
            >
              Profile
            </button>
            <button
              className="side-item"
              onClick={() => {
                navigate("/contact");
                setMenuOpen(false);
              }}
            >
              Contact
            </button>

            <button
              className="side-item"
              onClick={() => {
                navigate("/about");
                setMenuOpen(false);
              }}
            >
              About
            </button>

            <button
              className="side-item logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div className="content-small">
            <DailyGoal allLogs={allLogs} />
            <HabitManager
              allLogs={allLogs}
              refetchLogs={refetch}
            />
          </div>

          {hasLogs && (
            <HabitProgressChart allLogs={allLogs} />
          )}

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
  );
}

function AppRoutes() {
  const { allLogs, loading, refetch } = useAllHabitLogs();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("login");

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

  if (!isLoggedIn) {
    return (
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
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            allLogs={allLogs}
            loading={loading}
            refetch={refetch}
            handleLogout={handleLogout}
          />
        }
      />

      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;