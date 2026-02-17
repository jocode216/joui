import { Link } from "react-router-dom";
import "./adminmenu.css";

const CoursesShowcase: React.FC = () => {
  return (
    <div className="wrapper">
      {/* MERN Stack Course */}
      <div className="card">
        <div className="card-header">
          <h3>MERN Stack Mentorship</h3>
        </div>
        <p>
          Learn real application architecture, folder structure, authentication
          flows, all CRUD operations, and deployment - the practical knowledge
          most courses skip.
        </p>
        <div className="admin-btn">
          <Link to="/detail">
            <button style={{ background: "gray" }}>Preview Free</button>
          </Link>
        </div>
      </div>

      {/* Core Foundations */}
      <div className="card">
        <div className="card-header">
          <h3>Core Foundations</h3>
        </div>
        <p>
          Build your development foundation. Learn Operating Systems, Internet &
          Web Basics, and set up your Development Environment. Essential
          knowledge before writing any code.
        </p>
        <div className="admin-btn">
          <Link to="/foundations">
            <button style={{ background: "gray" }}>Start Foundation</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesShowcase;
