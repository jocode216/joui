import React from "react";
import { Link } from "react-router-dom";

const Fourfour: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        background: "#fff",
        color: "#333",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "6rem", margin: 0 }}>404</h1>
      <p style={{ fontSize: "1.5rem", margin: "1rem 0" }}>
        Oops! Page not found
      </p>
      <Link
        to="/"
        style={{
          textDecoration: "none",
          padding: "0.5rem 1rem",
          backgroundColor: "red",
          color: "#fff",
          borderRadius: "4px",
          transition: "0.3s",
        }}
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Fourfour;
