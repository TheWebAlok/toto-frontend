import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error("All fields are required!");
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/signup", form);
      localStorage.setItem("token", data.token);

      toast.success("Signup successful");

      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
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
        />

        <input 
          type="email" 
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input 
          type="password" 
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <button disabled={loading}>
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
