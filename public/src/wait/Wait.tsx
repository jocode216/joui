import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./wait.css";

function Wait() {
  const [userName, setUserName] = useState("");
  const [dots, setDots] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.full_name || user.name || "there");
    }

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 1000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(messageTimer);
    };
  }, []);

  const getFirstName = (fullName: string) => {
    if (!fullName) return "there";
    return fullName.split(" ")[0];
  };

  return (
    <div className="wait-container">
      <div className="message-animation">
        <div className="message-bubble typing">
          <div className="typing-indicator">
            <span>Jocode is typing</span>
            <div className="typing-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>

        {showMessage && (
          <div className="message-bubble received">
            <div className="message-header">
              <div className="sender-avatar" style={{ color: "white" }}>
                JT
              </div>
              <div className="sender-info">
                <span className="sender-name">Jocode Team</span>
                <span className="message-time">Now</span>
              </div>
            </div>
            <div className="message-content">
              <p>
                Hey <strong>{getFirstName(userName)}</strong>! 👋
              </p>
              <p>
                Thank you for registering with Jocode! Your application has been
                received and is currently under review.
              </p>
              <p className="approval-time">
                <strong>Approval usually takes 1-2 hours</strong>
              </p>
              <p>
                We'll notify you as soon as your account is approved. In the
                meantime, you can:
              </p>
              <div className="suggestions">
                <Link to="/courses" className="suggestion-link">
                  Check out our course catalog
                </Link>
                <Link to="/resource" className="suggestion-link">
                  Explore learning resources
                </Link>
                <Link to="/roadmap" className="suggestion-link">
                  View learning roadmaps
                </Link>
              </div>
              <p style={{ marginTop: "1rem" }}>
                Need help? Contact us at{" "}
                <a href="mailto:contact@josephteka.com">
                  contact@josephteka.com
                </a>{" "}
                or Telegram{" "}
                <a
                  href="https://t.me/josephteka"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @josephteka
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wait;
