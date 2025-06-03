import React from "react";

const NewsVerification = ({ data }) => {
  return (
    <div className="news-verification">
      <h3>News Verification Result</h3>
      <p><strong>Claim:</strong> {data.claim}</p>
      <p><strong>Verdict:</strong> {data.verdict}</p>
      <p><strong>Confidence:</strong> {data.confidence}%</p>
      <p><strong>Explanation:</strong> {data.explanation}</p>
    </div>
  );
};

export default NewsVerification;