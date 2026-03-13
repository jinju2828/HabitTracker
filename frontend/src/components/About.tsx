import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>About</h1>
      <p>
        Habit Tracker is a simple app designed to help you stay consistent
        with your daily habits.
      </p>

      <p>
        Track your progress, visualize streaks, and build better routines.
      </p>

        <button onClick={() => navigate("/")}>
        ← Back to Habit Tracker
        </button>
    </div>
  );
}

export default About;