import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      toast.success("Login successful");

      setTimeout(() => navigate("/todo"), 1000);

    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("User not found");
      } 
      else if (err.response?.status === 401) {
        toast.error("Incorrect password");
      } 
      else if (err.response?.status === 400) {
        toast.error(err.response.data.message);
      } 
      else {
        toast.error("Server not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <a href="/">Back</a>
      </form>
    </div>
  );
}
