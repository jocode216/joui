import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  DollarSign,
  Users,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface DashboardStatsResponse {
  success: boolean;
  data: {
    stats: {
      totalCourses: number;
      pendingCourses: number;
      approvedCourses: number;
      rejectedCourses: number;
      totalStudents: number;
      totalTeachers: number;
      totalEnrollments: number;
      totalRevenue: number;
    };
  };
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    pendingCourses: 0,
    approvedCourses: 0,
    rejectedCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getAuthToken = (): string | null => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the dashboard",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // If endpoint doesn't exist yet, use mock data
        console.warn("Admin stats endpoint not found, using mock data");
        setStats({
          totalCourses: 0,
          pendingCourses: 0,
          approvedCourses: 0,
          rejectedCourses: 0,
          totalStudents: 0,
          totalTeachers: 0,
          totalEnrollments: 0,
          totalRevenue: 0,
        });
        return;
      }

      const result: DashboardStatsResponse = await response.json();

      if (result.success && result.data) {
        setStats({
          totalCourses: result.data.stats.totalCourses || 0,
          pendingCourses: result.data.stats.pendingCourses || 0,
          approvedCourses: result.data.stats.approvedCourses || 0,
          rejectedCourses: result.data.stats.rejectedCourses || 0,
          totalStudents: result.data.stats.totalStudents || 0,
          totalTeachers: result.data.stats.totalTeachers || 0,
          totalEnrollments: result.data.stats.totalEnrollments || 0,
          totalRevenue: result.data.stats.totalRevenue || 0,
        });
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Welcome to Jocode</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Loader2 className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Courses"
            value={stats.totalCourses.toString()}
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingCourses.toString()}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title="Total Enrollments"
            value={stats.totalEnrollments.toString()}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents.toString()}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers.toString()}
            icon={<GraduationCap className="h-5 w-5" />}
          />
        </div>

        {/* Course Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-accent p-4 rounded-lg">
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <div className="text-sm text-muted-foreground">Total Courses</div>
              </div>
              <div className="bg-accent p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {stats.approvedCourses}
                </div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
              <div className="bg-accent p-4 rounded-lg">
                <div className="text-2xl font-bold text-amber-600 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {stats.pendingCourses}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="bg-accent p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  {stats.rejectedCourses}
                </div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
