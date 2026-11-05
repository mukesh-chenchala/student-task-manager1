
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await axios.post(
        "https://student-task-manager-48bb.onrender.com/api/auth/login",
        {
          registrationNumber,
          password
        }
      );

      const { token, user } = response.data;

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="sparkle sparkle-one">✦</div>
      <div className="sparkle sparkle-two">✧</div>
      <div className="sparkle sparkle-three">✨</div>
      <div className="sparkle sparkle-four">✦</div>

      <div className="login-card">

        <div className="login-logo">🎓</div>

        <h1>Welcome Back!</h1>

        <p className="login-subtitle">
          Your productivity journey starts here.
        </p>

        <form onSubmit={handleLogin}>

          <label>Registration Number</label>
          <input
            type="text"
            placeholder="Enter your registration number"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-options">

            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <span>Student Account</span>

          </div>

          {error && (
            <p style={{ color: "red", gridColumn: "1 / -1" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login ✨"}
          </button>

        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>

        <p className="login-footer">
          ✦ Dream • Plan • Achieve ✦
        </p>

      </div>
    </div>
  );
}

export default Login;
