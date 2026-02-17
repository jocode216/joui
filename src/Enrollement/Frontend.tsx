import { Link } from "react-router-dom";
import "./frontend.css";

const CoursesShowcase: React.FC = () => {
  return (
    <div className="wrapper">
      {/* HTML Full Course - Free */}
      <div className="card">
        <img
          src="https://img.youtube.com/vi/9u8LjczycLE/hqdefault.jpg"
          alt="HTML Foundation"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://img.youtube.com/vi/EVFYZl91j8A/hqdefault.jpg";
          }}
        />
        <h3>HTML Full Course</h3>
        <p>
          Master the core foundation of web development. Perfect for ensuring
          your basics are rock-solid before diving into full-stack application
          development.
          <span
            style={{
              color: "#ff6b35",
              fontSize: "18px",
              fontWeight: "bold",
              display: "block",
              marginTop: "8px",
            }}
          >
            Completely Free
          </span>
        </p>
        <div className="admin-btn">
          <Link to="/html">
            <button style={{ background: "gray", color: "white" }}>
              Start Learning Free
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesShowcase;
