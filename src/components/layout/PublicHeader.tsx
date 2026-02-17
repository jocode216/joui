import { Link } from "react-router-dom";

export default function PublicHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center h-[70px]">
        <Link to="/" className="text-xl font-bold text-foreground no-underline">
          Jocode
        </Link>

        <nav className="hidden md:flex gap-6">
          {[
            { label: "Courses", path: "/courses" },
            { label: "About", path: "/about" },
            { label: "Resource", path: "/resource" },
            { label: "Roadmap", path: "/roadmap" },
            { label: "Achievement", path: "/achievement" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-muted-foreground font-medium px-3 py-2 rounded-lg transition-colors hover:bg-secondary hover:text-foreground text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <button className="btn-outline-primary text-sm">Sign In</button>
          </Link>
          <Link to="/register">
            <button className="btn-primary text-sm">Join Class</button>
          </Link>
        </div>
      </div>
    </header>
  );
}
