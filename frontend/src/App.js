import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SubmitArticle from "./pages/SubmitArticle";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chatbot from "./components/Chatbot";
import "./styles/global.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [page, setPage] = useState("home");
  const navigate = useNavigate();

  const handlePageChange = (newPage) => {
    setPage(newPage);
    navigate(`/${newPage === "home" ? "" : newPage}`);
  };

  return (
    <div>
      <Navbar setPage={handlePageChange} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitArticle />} />
        <Route path="/community" element={<Community />} />
        <Route
          path="/login"
          element={<Login onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/register"
          element={<Register onRegister={() => navigate("/login")} />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Login onLogin={() => setIsAuthenticated(true)} />}
        />
      </Routes>
      <Chatbot />
    </div>
  );
}

export default App;
