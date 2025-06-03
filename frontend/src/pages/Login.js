import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        if (onLogin) onLogin();
        navigate("/dashboard");
      } else {
        if (data.message === "User not found") {
          const confirmRegister = window.confirm("User not found. Would you like to register?");
          if (confirmRegister) {
            navigate("/register");
          } else {
            setError("Please register or check your credentials.");
          }
        } else {
          setError(data.message);
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <motion.div className="login-container">
      <div className="login-background" />
      <div className="login-overlay" />
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Sign In</button>
      </form>
    </motion.div>
  );
};

export default Login;