import { Link, useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  GraduationCap,
  Search,
  ChevronLeft,
  LogOut,
  Award,
  Plus,
  FolderOpen,
  CheckSquare,
} from "lucide-react";

const navItems = {
  user: [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "My Courses", path: "/my-courses", icon: BookOpen },
    { title: "Browse Courses", path: "/courses", icon: Search },
    { title: "My Requests", path: "/my-requests", icon: ClipboardList },
    { title: "My Certificates", path: "/my-certificates", icon: Award },
  ],
  teacher: [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "Add Course", path: "/admin/addcourse", icon: Plus },
    { title: "Students", path: "/students", icon: Users },
    { title: "My Certificates", path: "/my-certificates", icon: Award },
  ],
  admin: [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "Users", path: "/admin/users", icon: Users },
    { title: "Courses", path: "/admin/courses", icon: BookOpen },
    { title: "Approvals", path: "/admin/approvals", icon: CheckSquare },
    { title: "Teachers", path: "/admin/teachers", icon: GraduationCap },
    { title: "Certificates", path: "/admin/certificates", icon: Award },
  ],
};

const getInitials = (name: string) =>
  name
    ? name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

interface DashboardSidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function DashboardSidebar({ className, onClose }: DashboardSidebarProps) {
  const { role, userName } = useRole();
  const location = useLocation();
  const items = navItems[role as keyof typeof navItems] || [];

  const getLinkClasses = (isActive: boolean) => {
    const baseClasses = 'flex items-center gap-3 px-3 py-2 rounded-md transition-colors whitespace-nowrap';
    const activeClasses = isActive 
      ? 'bg-primary text-primary-foreground' 
      : 'text-muted-foreground hover:bg-muted hover:text-foreground';
    
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <aside className={`group fixed left-0 top-0 z-40 h-screen w-64 md:w-20 md:hover:w-64 border-r border-border bg-background transition-all duration-300 ease-in-out overflow-hidden shadow-lg ${className || ''}`}>
      {/* Header */}
      <div className="flex h-16 items-center border-b border-border px-6 justify-between whitespace-nowrap">
        <Link to="/" className="text-xl font-semibold tracking-tight md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          Jocode
        </Link>
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <span className="ml-2 text-xs text-muted-foreground capitalize hidden md:inline">
          {role}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === "/admin/certificates" && location.pathname.startsWith("/admin/certificates")) ||
                          (item.path === "/my-certificates" && location.pathname === "/my-certificates");
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={getLinkClasses(isActive)}
            >
              <item.icon className="h-5 w-5 min-w-[20px]" />
              <span className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer with User Info */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4 whitespace-nowrap">
        {/* User info */}
        <div className="flex items-center gap-3 bg-accent rounded-lg p-2.5">
          <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
            {getInitials(userName || "")}
          </div>
          <div className="min-w-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-medium text-foreground truncate">{userName || "User"}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        </div>

        {/* Logout Link */}
        <Link 
          to="/login"
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-2"
        >
          <LogOut className="h-5 w-5 min-w-[20px]" />
          <span className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            Logout
          </span>
        </Link>
      </div>
    </aside>
  );
}