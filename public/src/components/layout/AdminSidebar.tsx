import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Users,
  Store,
  BarChart3,
  LogOut,
  ChevronLeft,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isStoreOwner?: boolean;
  isTeacher?: boolean;
  className?: string;
  onClose?: () => void;
}

const AdminSidebar = ({ 
  isStoreOwner = false, 
  isTeacher = false,
  className, 
  onClose 
}: AdminSidebarProps) => {
  const location = useLocation();

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { to: '/admin/enrollments', icon: ShoppingCart, label: 'Enrollments' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/stores', icon: Store, label: 'Stores' },
  ];

  const teacherLinks = [
    { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/teacher/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/teacher/enrollments', icon: Users, label: 'My Students' },
  ];

  const links = isTeacher ? teacherLinks : (isStoreOwner ? [
    { to: '/store', icon: LayoutDashboard, label: 'Store' },
    { to: '/store/products', icon: BookOpen, label: 'My Products' },
    { to: '/store/orders', icon: ShoppingCart, label: 'My Orders' },
    { to: '/store/reports', icon: BarChart3, label: 'Reports' },
  ] : adminLinks);

  const basePath = isTeacher ? '/teacher/dashboard' : (isStoreOwner ? '/store' : '/admin/dashboard');

  return (
    <aside className={cn("group fixed left-0 top-0 z-40 h-screen w-64 md:w-20 md:hover:w-64 border-r border-border bg-background transition-all duration-300 ease-in-out overflow-hidden shadow-lg", className)}>
      <div className="flex h-16 items-center border-b border-border px-6 justify-between whitespace-nowrap">
        <Link to="/" className="text-xl font-semibold tracking-tight md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          Kanaho
        </Link>
        {onClose && (
            <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-5 w-5" />
            </button>
        )}
        {isTeacher && (
          <span className="ml-2 text-xs text-muted-foreground">Teacher</span>
        )}
        {isStoreOwner && !isTeacher && (
          <span className="ml-2 text-xs text-muted-foreground">Store</span>
        )}
        {!isStoreOwner && !isTeacher && (
          <span className="ml-2 text-xs text-muted-foreground">Admin</span>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => {
          const isActive =
            location.pathname === link.to ||
            (link.to !== basePath && location.pathname.startsWith(link.to));

          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'sidebar-item flex items-center gap-3 px-3 py-2 rounded-md transition-colors whitespace-nowrap',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <link.icon className="h-5 w-5 min-w-[20px]" />
              <span className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4 whitespace-nowrap">
        <Link to="/" className="sidebar-item text-muted-foreground flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted hover:text-foreground transition-colors">
          <LogOut className="h-5 w-5 min-w-[20px]" />
          <span className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            Back to site
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
