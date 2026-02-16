import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Users,
  PlusCircle,
  Clock,
  CheckCircle,
  Loader2,
  RefreshCw,
  GraduationCap,
  Video,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const TeacherDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    approvedCourses: 0,
    pendingCourses: 0,
    totalEnrollments: 0,
    recentCourses: [],
  });

  useEffect(() => {
    fetchTeacherDashboardData();
  }, []);

  const fetchTeacherDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "Please login to access dashboard",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Fetch teacher's courses
      const coursesResponse = await fetch(`${API_BASE_URL}/teacher/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!coursesResponse.ok) {
        throw new Error("Failed to fetch courses");
      }

      const coursesData = await coursesResponse.json();
      const courses = coursesData.data || [];

      const approvedCourses = courses.filter((c) => c.status === "APPROVED");
      const pendingCourses = courses.filter((c) => c.status === "PENDING");

      // Get total enrollments across all approved courses
      let totalEnrollments = 0;
      for (const course of approvedCourses) {
        try {
          const enrollResponse = await fetch(
            `${API_BASE_URL}/teacher/courses/${course.id}/enrollments`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (enrollResponse.ok) {
            const enrollData = await enrollResponse.json();
            totalEnrollments += enrollData.data?.length || 0;
          }
        } catch (err) {
          console.error(`Error fetching enrollments for course ${course.id}:`, err);
        }
      }

      setDashboardData({
        totalCourses: courses.length,
        approvedCourses: approvedCourses.length,
        pendingCourses: pendingCourses.length,
        totalEnrollments,
        recentCourses: courses.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTeacherDashboardData();
  };

  if (loading) {
    return (
      <AdminLayout isTeacher>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading teacher dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout isTeacher>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your courses and track student enrollments
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button onClick={() => navigate("/teacher/courses/add")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Courses */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalCourses}
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-600">
                    {dashboardData.approvedCourses} approved
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-3 w-3 mr-1 text-amber-500" />
                  <span className="text-amber-600">
                    {dashboardData.pendingCourses} pending
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Enrollments */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalEnrollments}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Across all courses
              </p>
            </CardContent>
          </Card>

          {/* Approved Courses */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                Active Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.approvedCourses}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Published and active
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Video className="h-4 w-4 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate("/teacher/courses/add")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Course
                </Button>
                <Button
                  onClick={() => navigate("/teacher/courses")}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View All Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Your Courses
              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                {dashboardData.recentCourses.length}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/teacher/courses")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {dashboardData.recentCourses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.recentCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          {course.title}
                        </TableCell>
                        <TableCell>
                          ETB {course.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`
                            ${
                              course.status === "APPROVED"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : course.status === "PENDING"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
                          >
                            {course.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(course.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                <p className="max-w-sm mx-auto mb-4">
                  Create your first course to start teaching students.
                </p>
                <Button onClick={() => navigate("/teacher/courses/add")}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TeacherDashboard;
