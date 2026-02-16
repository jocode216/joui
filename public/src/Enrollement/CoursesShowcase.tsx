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

      {/* Frontend Development Path */}
      <div className="card">
        <div className="card-header">
          <h3>Frontend Development</h3>
        </div>
        <p>
          Master HTML, CSS, JavaScript, and React.js. Build beautiful,
          interactive websites with responsive design and modern frameworks.
        </p>
        <div className="admin-btn">
          <Link to="/frontend">
            <button style={{ background: "gray" }}>Start Frontend</button>
          </Link>
        </div>
      </div>

      {/* Backend Development Path */}
      <div className="card">
        <div className="card-header">
          <h3>Backend Development</h3>
        </div>
        <p>
          Build servers, APIs, and databases. Learn Node.js, Express, MySQL,
          MongoDB, authentication, and deployment.
        </p>
        <div className="admin-btn">
          <Link to="/backend">
            <button style={{ background: "gray" }}>Start Backend</button>
          </Link>
        </div>
      </div>

      {/* Full-Stack Mastery */}
      <div className="card">
        <div className="card-header">
          <h3>Full-Stack Mastery</h3>
        </div>
        <p>
          Combine frontend and backend skills. Build real-world applications
          like E-commerce platforms, Social Media apps, and Netflix clones.
        </p>
        <div className="admin-btn">
          <Link to="/fullstack">
            <button style={{ background: "gray" }}>Start Mastery</button>
          </Link>
        </div>
      </div>

      {/* Tech Talk */}
      <div className="card">
        <div className="card-header">
          <h3>Tech Talk</h3>
        </div>
        <p>
          Get insights into the tech industry, career advice, and emerging
          trends from industry experts.
        </p>
        <div className="admin-btn">
          <Link to="/updates">
            <button style={{ background: "gray", color: "white" }}>
              Watch Talks
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesShowcase;
