import React, { useState, useEffect } from "react";
import Graphs from "../components/Graphs";
import VersionHistory from "../components/VersionHistory";
import CredibilityScore from "../components/CredibilityScore";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setDashboardData(data);
        } else {
          console.error("Failed to fetch dashboard data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    
    <div className="container">
      <br/>
      <br/>
      <br/>
      <br/>
      <h2>Verification Dashboard</h2>
      <Graphs />
      <CredibilityScore />
      <VersionHistory />
    </div>
  );
};

export default Dashboard;

