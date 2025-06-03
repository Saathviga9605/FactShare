
import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/global.css";
import Login from "./Login";
import { FaBrain, FaImage, FaStar } from "react-icons/fa";
import indiaImage from "../assets/india.jpg";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  return (
    <>
      {showLogin ? (
        <Login />
      ) : (
        <>
          {isPopupVisible && (
            <motion.div
              className="popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="popup-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img src={indiaImage} alt="Misinformation Alert" className="popup-image" />
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="popup-text"
                >
                  India ranks first!! At what? Misinformation!!!
                  <br />
                  Don't you think it's time to verify the news you read?
                </motion.h2>
                <motion.button
                  className="popup-close-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPopupVisible(false)}
                >
                  Yes!
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {!isPopupVisible && (
            <motion.div
              className="container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="breaking-news-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="breaking-news-label">🚨 Breaking News</div>
                <marquee className="breaking-news-marquee" behavior="scroll" direction="left">
                  <span className="flashing">⚠ Nearly 80% of India's first-time voters face fake news on social media! </span>
                  <span className="flashing">⚠ India ranks as the highest risk for misinformation! </span>
                  <span className="flashing">⚠ 20 people were killed in 2018 due to misinformation on social media! </span>
                  <span className="flashing">⚠ 59% of forwarded messages in political WhatsApp groups in India contained misinformation! </span>
                  <span className="flashing">⚠ Deepfake videos increased by over 900% between 2019 and 2022, posing a major misinformation threat! </span>
                  <span className="flashing">⚠ False information spreads six times faster than the truth on Twitter, according to MIT research! </span>
                  <span className="flashing">⚠ Over 70% of fake news articles originate from unverified social media sources! </span>
                  <span className="flashing">⚠ A single fake news article can reach up to 100,000 people within hours! </span>
                  <span className="flashing">⚠ During the COVID-19 pandemic, WHO termed misinformation a "Infodemic" due to its deadly impact! </span>
                  <span className="flashing">⚠ AI-generated fake news is now more believable than human-written fake news! </span>
                </marquee>
              </motion.div>

              <section className="hero">
                <div className="hero-overlay">
                  <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    Unmask the Truth, One Click at a Time.
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    AI-powered fact-checking at your fingertips. Detect fake news, verify sources, and stay informed.
                  </motion.p>
                  <br />
                  <br />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowLogin(true)}
                  >
                    Join the movement
                  </motion.button>
                </div>
              </section>

              <section className="why-factshare">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  WHY FACTSHARE?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  In today's digital world, misinformation spreads faster than ever, influencing public opinions,
                  shaping narratives, and even impacting critical decisions. FactShare is your digital
                  shield against misinformation, leveraging advanced AI, expert verification, and community-driven insights
                  to ensure you receive accurate and reliable information. Because in an era of rapid information exchange,
                  truth matters more than ever.
                </motion.p>
              </section>

              <section className="features">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  FEATURES
                </motion.h2>

                <div className="feature-container">
                  <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
                    <FaBrain className="feature-icon" />
                    <h3>AI & API Fact-Checking</h3>
                    <p>Cross-verify news articles using Google Fact Check API and AI models trained on real datasets.</p>
                  </motion.div>

                  <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
                    <FaImage className="feature-icon" />
                    <h3>Image Verification</h3>
                    <p>Detect fake images using OCR text extraction and similarity models to ensure authenticity.</p>
                  </motion.div>

                  <motion.div className="feature-card" whileHover={{ scale: 1.05 }}>
                    <FaStar className="feature-icon" />
                    <h3>Credibility Scoring</h3>
                    <p>Analyze credibility through AI-driven validation, API cross-referencing, and community voting.</p>
                  </motion.div>
                </div>
              </section>

              <motion.footer
                className="footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <p>Developed by <span className="team-name">Team ERROR 404</span></p>
                <p>In an attempt to raise awareness - <span className="team-members">Saathviga, Rakshitha, Priyan, Mohit</span></p>
              </motion.footer>
            </motion.div>
          )}
        </>
      )}
    </>
  );
};

export default Home;

