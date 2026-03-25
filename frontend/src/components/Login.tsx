import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/habitApi';
import "../styles/Login.css";

interface LoginProps {
  onLoginSuccess: () => void;
  goToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, goToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('access_token', res.data.access_token);
      setError('');
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    } 
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>🌿 Habit Tracker</h1>
          <p>Build consistency. Track progress.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div className="spinner" />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="switch-auth">
          Don't have an account? <span onClick={goToSignup}>Sign up</span>
        </p>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default Login;