import React from "react";
import "../styles/global.css";

const Navbar = ({ setPage, darkMode, toggleDarkMode }) => {
  return (
    <nav className="glass navbar">
      <div className="logo" onClick={() => setPage("home")}>
        <h1>FactShare</h1>
        <p className="motto">Verify, Trust, Share</p>
      </div>
      <div className="nav-links">
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("community")}>Community</button>
        <button onClick={() => setPage("submit")}>Submit an Article</button>
        <button onClick={() => setPage("register")}>Register</button>
        <button onClick={() => setPage("login")}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
