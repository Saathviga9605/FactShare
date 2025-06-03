// ArticleHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

function ArticleHistory() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if the user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/article-history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch article history.');
      }
    };

    fetchArticles();
  }, [token, navigate]);

  return (
    <div className="container">
      <h2 className="title">Your Submitted Articles</h2>
      {error && <div className="error-message">{error}</div>}
      {articles.length === 0 ? (
        <p>No articles submitted yet.</p>
      ) : (
        <div className="articles-grid">
          {articles.map((article) => (
            <div key={article._id} className="article-card">
              <h3 className="article-title">{article.title}</h3>
              <p><strong>Type:</strong> {article.type}</p>
              <p><strong>Credibility Score:</strong> {article.credibilityScore}%</p>
              <p><strong>Submitted At:</strong> {new Date(article.submittedAt).toLocaleString()}</p>
              {article.type === 'text' ? (
                <p><strong>Content:</strong> {article.content}</p>
              ) : (
                <img src={article.content} alt="Uploaded" className="uploaded-image" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArticleHistory;