import { Link } from "react-router-dom";
import './footer.css'

function Footer() {
  return (
    <div className="footer">
      <div className="footer-section">
        <Link to="/">
          <h2>Jocode</h2>
        </Link>
        <p style={{color:'#fff'}}>
          &copy; 2024 All rights reserved
        </p>
      </div>

      <div className="footer-section">
        <h3>Useful Links</h3>
        <Link to="/register">Register</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/resource">Resource</Link>
      </div>

      <div className="footer-section">
        <h3>Contact Us</h3>
        <a
          href="https://contact@josephteka.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Email
        </a>
        <a
          href="https://portfolio.josephteka.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio
        </a>
        <a
          href="https://www.linkedin.com/in/josephteka/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}

export default Footer;
