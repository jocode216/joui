import { Link, useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  GraduationCap,
  Search,
  UserCheck,
  ChevronDown,
} from "lucide-react";

const navItems = {
  user: [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "My Courses", path: "/my-courses", icon: BookOpen },
    { title: "Browse Courses", path: "/courses", icon: Search },
  ],
  teacher: [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "My Courses", path: "/my-courses", icon: BookOpen },
    { title: "Students", path: "/students", icon: Users },
  ],
  admin: [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "Users", path: "/admin/users", icon: Users },
    { title: "Courses", path: "/courses", icon: BookOpen },
    { title: "Requests", path: "/admin/requests", icon: ClipboardList },
    { title: "Teachers", path: "/admin/teachers", icon: GraduationCap },
  ],
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function DashboardSidebar() {
  const { role, setRole, userName } = useRole();
  const location = useLocation();
  const items = navItems[role];

  return (
    <aside className="w-60 border-r border-border bg-card flex flex-col min-h-screen shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link to="/" className="text-xl font-bold text-foreground">
          Jocode
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={active ? "sidebar-link-active" : "sidebar-link"}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Role Switcher (Demo) */}
      <div className="p-3 border-t border-border space-y-3">
        <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Demo Role
        </label>
        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "teacher" | "admin")}
            className="w-full appearance-none bg-secondary text-foreground text-sm rounded-lg px-3 py-2 pr-8 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="user">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 bg-accent rounded-lg p-2.5">
          <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
            {getInitials(userName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
