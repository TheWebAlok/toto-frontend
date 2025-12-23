import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api"; // Make sure this points to axios instance configured with baseURL
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/auth/signup", form);

      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        toast.success("Signup successful!");
        navigate("/");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred";
      toast.error(message);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <span className="link-text" onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
}
