
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullName: name,
          registrationNumber,
          email,
          password
        }
      );

      setSuccess(response.data.message);

      setName("");
      setRegistrationNumber("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-sparkle s1">✦</div>
      <div className="register-sparkle s2">✧</div>
      <div className="register-sparkle s3">✨</div>
      <div className="register-sparkle s4">✦</div>

      <div className="register-card">

        <div className="register-logo">🎓</div>

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Start planning your success today!
        </p>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Registration Number</label>
          <input
            type="text"
            placeholder="Enter your registration number"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />

          {error && (
            <p style={{ color: "red", gridColumn: "1 / -1" }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{ color: "green", gridColumn: "1 / -1" }}>
              {success}
            </p>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account ✨"}
          </button>

        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/">Login Here</Link>
        </p>

        <p className="register-footer">
          ✦ Believe • Begin • Become ✦
        </p>

      </div>
    </div>
  );
}

export default Register;
