import React, { useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./nav.css"; // custom CSS
import {AuthContext} from "../../context/AuthContext"

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");

  }  

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">Task Manager</div>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776;
        </button>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link to="/employee">Employee Dash</Link>
          <Link to="/task">Task Dash</Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Nav
