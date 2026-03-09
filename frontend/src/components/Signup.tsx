import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

interface SignupProps {
  onSignupSuccess: () => void;
  goToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, goToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
      });

      setError("");
      onSignupSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>🌿 Habit Tracker</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSignup}>
          {/* EMAIL */}
          <div className="input-group">
            <span className="input-icon">✉</span>
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-group">
            <span className="input-icon">🔐</span>
            <input
              type="password"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm Password</label>
          </div>

          <button
            type="submit"
            className={`login-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : "Create Account"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="switch-auth">
            Already have an account? <span onClick={goToLogin}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;