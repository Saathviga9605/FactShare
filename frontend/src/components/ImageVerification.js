import React from "react";

const ImageVerification = ({ data }) => {
  return (
    <div className="image-verification">
      <h3>Image Verification Result</h3>
      <p><strong>Extracted Text:</strong> {data.extracted_text}</p>
      <p><strong>Verdict:</strong> {data.verdict}</p>
      <p><strong>Confidence:</strong> {data.confidence}%</p>
      <p><strong>Explanation:</strong> {data.explanation}</p>
    </div>
  );
};

export default ImageVerification;