import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  teacherStatus?: string;
}

export default function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleDashboardNavigation = () => {
    closeMobileMenu();

    if (!user) {
      navigate("/login");
      return;
    }

    // Navigate based on user role
    switch (user.role) {
      case "admin":
        navigate("/dashboard");
        break;
      case "teacher":
        navigate("/dashboard");
        break;
      case "student":
      default:
        navigate("/dashboard");
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    closeMobileMenu();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center h-[70px] md:h-[70px]">
        <Link to="/" className="text-2xl font-bold text-gray-800 no-underline">
          Jocode
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {[
            { label: "Courses", path: "/courses" },
            { label: "Resources", path: "/resource" },
            { label: "Roadmap", path: "/roadmap" },
            { label: "About", path: "/about" },
            { label: "Achievements", path: "/achievements" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-gray-700 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={handleDashboardNavigation}
                className="bg-[#ede0d0] text-gray-900 border-none px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors duration-300 hover:bg-[#ede0d0]/80"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="bg-transparent text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors duration-300 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-transparent text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors duration-300 hover:bg-gray-100">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-[#ede0d0] text-gray-900 border-none px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors duration-300 hover:bg-[#ede0d0]/80">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu */}
        <button
          className={`md:hidden flex flex-col gap-1 bg-transparent border-none cursor-pointer p-2 ${
            isMobileMenuOpen ? "active" : ""
          }`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span
            className={`w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-[-100%] w-64 h-screen bg-white transition-all duration-300 ease-in-out z-[1001] px-5 py-20 flex flex-col shadow-lg md:hidden ${
          isMobileMenuOpen ? "!left-0" : ""
        }`}
      >
        <nav className="flex flex-col">
          {[
            { label: "Courses", path: "/courses" },
            { label: "Resources", path: "/resource" },
            { label: "Roadmap", path: "/roadmap" },
            { label: "About", path: "/about" },
            { label: "Achievements", path: "/achievements" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-gray-800 no-underline rounded-lg mb-2 transition-all duration-300 font-medium hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile User Info and Actions */}
          {user && (
            <>
              <div className="px-4 py-3 text-gray-600 border-t border-gray-200 mt-4">
                <p className="font-medium">
                  Welcome, {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1 capitalize">
                  Role: {user.role}
                </p>
              </div>
              <button
                onClick={handleDashboardNavigation}
                className="w-full bg-[#ede0d0] text-gray-900 border-none py-3 font-semibold rounded-lg transition-colors duration-300 hover:bg-[#ede0d0]/80 mb-2"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-transparent text-gray-700 border border-gray-300 py-3 font-semibold rounded-lg transition-colors duration-300 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Auth Section */}
        {!user && (
          <div className="mt-auto">
            <Link to="/login" onClick={closeMobileMenu}>
              <button className="w-full bg-transparent text-gray-700 border border-gray-300 py-3 font-semibold rounded-lg transition-colors duration-300 hover:bg-gray-100 mb-2">
                Login
              </button>
            </Link>
            <Link to="/register" onClick={closeMobileMenu}>
              <button className="w-full bg-[#ede0d0] text-gray-900 border-none py-3 font-semibold rounded-lg transition-colors duration-300 hover:bg-[#ede0d0]/80">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black/40 z-[1000] cursor-pointer md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}
    </header>
  );
}
