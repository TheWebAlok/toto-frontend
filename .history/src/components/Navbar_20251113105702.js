import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        
        <Link className="navbar-brand" to="/">TodoApp</Link>

        <button className="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
          </ul>

          
          {token && (
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                placeholder="Search tasks..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch(e.target.value); 
                }}
              />
            </form>
          )}

          {/* Buttons */}
          {!token ? (
            <>
              <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/signup">Signup</Link>
            </>
          ) : (
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          )}

        </div>
      </div>
    </nav>
  );
}
