import React from "react";
import { motion } from "framer-motion";

const history = [
  { date: "2025-03-10", change: "Initial verification - 75% credible" },
  { date: "2025-03-12", change: "Community votes raised credibility to 85%" },
  { date: "2025-03-14", change: "API updated - credibility adjusted to 90%" },
];

const VersionHistory = () => {
  return (
    <div>
      <h3>Version-Controlled Verification</h3>
      {history.map((item, index) => (
        <motion.div key={index} className="glass" whileHover={{ scale: 1.05 }}>
          <p>{item.date} - {item.change}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default VersionHistory;