import React, { useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import "../styles/global.css";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message (plain text, styled via CSS)
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        question: input,
      });

      // Add bot message (HTML content)
      const botMessage = { role: "assistant", content: response.data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant",
        content: "<p>Failed to get a response from the server. Please try again later.</p>",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {isOpen && (
        <div className="chat-box">
          <h2>📰 FactBot - Your News Assistant</h2>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.role === "user" ? "user-msg" : "bot-msg"}
                dangerouslySetInnerHTML={{
                  __html:
                    msg.role === "user"
                      ? msg.content // User messages are plain text
                      : DOMPurify.sanitize(msg.content, {
                          ADD_ATTR: ["href", "target"], // Allow href and target attributes
                        }), // Bot messages are HTML
                }}
              />
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything, and I'll fact-check it for you!"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;