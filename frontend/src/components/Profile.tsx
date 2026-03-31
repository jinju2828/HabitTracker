import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dailyGoal, setDailyGoal] = useState(localStorage.getItem("dailyGoal") || 3);
  const [avatar, setAvatar] = useState("🌱");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    const savedGoal = localStorage.getItem("dailyGoal");
    const savedAvatar = localStorage.getItem("avatar");
    const savedTheme = localStorage.getItem("theme");

    if (savedName) setName(savedName);
    if (savedGoal) setDailyGoal(Number(savedGoal));
    if (savedAvatar) setAvatar(savedAvatar);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleSave = () => {
    localStorage.setItem("user_name", name);
    localStorage.setItem("dailyGoal", String(dailyGoal));
    localStorage.setItem("avatar", avatar);
    localStorage.setItem("theme", theme);

    document.body.setAttribute("data-theme", theme);

    navigate("/");
  };

  const avatars = ["🌱", "🌿", "🌸", "🌻", "🍀", "🌵"];

  return (
    <div className="profile-container">
      {/* <h1>Profile</h1> */}

      <div className="profile-card">

        <label>Name</label>
        <input
          className="profile-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />

        <label>Daily Goal</label>
        <input
          type="number"
          className="profile-input"
          value={dailyGoal}
          min={1}
          max={20}
          onChange={(e) => setDailyGoal(Number(e.target.value))}
        />

        <label>Avatar</label>

        <div className="avatar-grid">
          {avatars.map((a) => (
            <button
              key={a}
              className={`avatar-btn ${avatar === a ? "selected" : ""}`}
              onClick={() => setAvatar(a)}
            >
              {a}
            </button>
          ))}
        </div>

        <label>Theme (Coming Soon)</label>

        <div className="theme-switch">
          <button
            className={theme === "light" ? "active" : ""}
            onClick={() => setTheme("light")}
          >
            Light
          </button>

          <button
            disabled={true}
            className={theme === "dark" ? "active" : ""}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
        </div>

        <div className="profile-actions">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>

          <button className="back-btn" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;