import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

// Define the User type based on your backend response
interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  receipt: string;
  role: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  // Fix: Handle cases where storedUser might be "undefined" string or null
  const user: User | null = storedUser && storedUser !== "undefined" && storedUser !== "null" 
    ? JSON.parse(storedUser) 
    : null;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/register");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = (): void =>
    setIsMobileMenuOpen((prevState) => !prevState);
  const closeMobileMenu = (): void => setIsMobileMenuOpen(false);

  // ✅ Generate initials from full_name (e.g. "Joseph Teka" → "JT")
  const getInitials = (fullName: string): string => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ");
    const initials = parts
      .map((p) => p.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
    return initials || "U";
  };

  // ✅ Get first name for welcome message
  const getFirstName = (fullName: string): string => {
    if (!fullName) return "User";
    return fullName.split(" ")[0];
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Jocode
        </Link>

        <nav className="desktop-nav">
          <Link to="/courses">Courses</Link>
          <Link to="/resource">Resources</Link>
          <Link to="/roadmap">Roadmap</Link>
          <Link to="/about"> About </Link>
          <Link to="/achievements"> Achievements </Link>
        </nav>

        <div className="user-section">
          {user ? (
            <div className="user-info">
              <span className="welcome-message">
                Welcome, {getFirstName(user.full_name)}
              </span>
              <div className="avatar" title={user.full_name}>
                {getInitials(user.full_name)}
              </div>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/register">
              <button>Join Class</button>
            </Link>
          )}
        </div>

        <button
          className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <nav>
          <Link to="/courses" onClick={closeMobileMenu}>
            Courses
          </Link>
          <Link to="/resource" onClick={closeMobileMenu}>
            Resources
          </Link>
          <Link to="/roadmap" onClick={closeMobileMenu}>
            Roadmap
          </Link>
          <Link to="/about" onClick={closeMobileMenu}>
            About
          </Link>
          <Link to="/achievements" onClick={closeMobileMenu}>
            Achievements
          </Link>

        </nav>

        <div className="mobile-auth">
          {user ? (
            <>
              <div className="user-details">
                <div className="avatar mobile" title={user.full_name}>
                  {getInitials(user.full_name)}
                </div>
                <div className="user-info-mobile">
                  <span className="welcome-message">
                    Welcome, {getFirstName(user.full_name)}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/register" onClick={closeMobileMenu}>
              <button>Join Class</button>
            </Link>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="overlay" onClick={closeMobileMenu}></div>
      )}
    </header>
  );
};

export default Header;
