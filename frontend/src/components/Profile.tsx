import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("user_name", name);
    navigate("/");
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Profile</h1>

      <p>Enter your name:</p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        style={{
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />

      <br />

      <button onClick={handleSave}>
        Save
      </button>

      <br /><br />

      <button onClick={() => navigate("/")}>
        ← Back
      </button>
    </div>
  );
}

export default Profile;