import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="content-box">
        <h1>Welcome to Smart TODO</h1>
        <p>
          Get organized, enhance productivity, and accomplish your goals with
          our intelligent task manager!
        </p>

        <div className="btn-group">
          <button onClick={() => navigate("/todo")} className="btn-primary">
            Goto Add Todos
          </button>
          <button onClick={() => navigate("/signup")} className="btn-secondary">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
