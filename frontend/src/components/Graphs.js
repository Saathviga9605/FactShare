import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", credibility: 65 },
  { name: "Feb", credibility: 70 },
  { name: "Mar", credibility: 80 },
  { name: "Apr", credibility: 85 },
  { name: "May", credibility: 90 },
];

const Graphs = () => {
  return (
    <div className="graph-container">
      <h3>Credibility Trend Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="credibility" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graphs;