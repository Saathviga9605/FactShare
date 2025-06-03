import React, { useState } from "react";
import axios from "axios";
import NewsVerification from "../components/NewsVerification";
import ImageVerification from "../components/ImageVerification";
import "../styles/global.css";

const SubmitArticle = () => {
  const [newsText, setNewsText] = useState("");
  const [image, setImage] = useState(null);
  const [newsResult, setNewsResult] = useState(null);
  const [imageResult, setImageResult] = useState(null);

  const verifyNews = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/verify-news", {
        claim: newsText,
      });
      setNewsResult(response.data);
    } catch (error) {
      console.error("Error verifying news:", error);
    }
  };

  const verifyImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://127.0.0.1:5001/verify-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageResult(response.data);
    } catch (error) {
      console.error("Error verifying image:", error);
    }
  };

  return (
    <div className="submit-container">
      <br />
      <br />
      <br />
      <h2 className="title">Submit News for Verification</h2>
      <textarea
        value={newsText}
        onChange={(e) => setNewsText(e.target.value)}
        placeholder=" Paste news article here..."
        className="input-box"
      />
      <button className="btn verify-btn" onClick={verifyNews}>
         Verify News
      </button>

      {newsResult && <NewsVerification data={newsResult} />}

      <h3 className="title">Upload Image for Verification</h3>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="input-file"
      />
      <button className="btn verify-btn" onClick={verifyImage}>
         Verify Image
      </button>

      {imageResult && <ImageVerification data={imageResult} />}
    </div>
  );
};

export default SubmitArticle;
