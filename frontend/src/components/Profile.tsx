import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UserProfileContext";
import { updateProfile } from "@/api/profileApi";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const {
    displayName,
    dailyGoal: ctxDailyGoal,
    avatar: ctxAvatar,
    loading,
    refreshProfile,
  } = useUserProfile();

  const [name, setName] = useState("");
  const [dailyGoal, setDailyGoal] = useState(1);
  const [avatar, setAvatar] = useState("🌱");
  const [theme, setTheme] = useState("light");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (loading) return;
    setName(displayName);
    setDailyGoal(ctxDailyGoal);
    setAvatar(ctxAvatar);
  }, [loading, displayName, ctxDailyGoal, ctxAvatar]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        display_name: name,
        daily_goal: dailyGoal,
        avatar,
      });
      await refreshProfile();
      localStorage.setItem("theme", theme);
      document.body.setAttribute("data-theme", theme);
      navigate("/");
    } catch (e) {
      console.error(e);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const avatars = ["🌱", "🌿", "🌸", "🌻", "🍀", "🌵"];

  return (
    <div className="profile-container">
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
              type="button"
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
            type="button"
            className={theme === "light" ? "active" : ""}
            onClick={() => setTheme("light")}
          >
            Light
          </button>

          <button
            type="button"
            disabled={true}
            className={theme === "dark" ? "active" : ""}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
        </div>

        <div className="profile-actions">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Saving…" : "Save"}
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
