import React from "react";
import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Contact</h1>
      <p>If you have any questions or feedback:</p>
      <p>Email: habittracker@example.com</p>
      <button onClick={() => navigate("/")}>
        ← Back to Habit Tracker
        </button>
    </div>
  );
}

export default Contact;