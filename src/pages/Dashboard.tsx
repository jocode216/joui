import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRole } from "@/contexts/RoleContext";
import StatCard from "@/components/StatCard";
import CourseCard from "@/components/CourseCard";
import {
  BookOpen,
  Users,
  GraduationCap,
  ClipboardList,
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";
import CoursesShowcase from "@/Enrollement/CoursesShowcase";
import { apiCall } from "@/lib/api";

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="dash-card p-8 text-center">
    <p className="text-destructive mb-4">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary">
        Try Again
      </button>
    )}
  </div>
);



// ==================== USER DASHBOARD ====================
function UserDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fetch user's enrollments and enrollment requests
      const [enrollData, requestsData] = await Promise.allSettled([
        apiCall("/users/me/enrollments"),
        apiCall("/users/me/enrollment-requests"),
      ]);

      if (enrollData.status === "fulfilled") {
        setEnrollments(enrollData.value.data || enrollData.value || []);
      }
      if (requestsData.status === "fulfilled") {
        const allRequests = requestsData.value.data || requestsData.value || [];
        setPendingRequests(allRequests.filter((r: any) => r.status === 'PENDING'));
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchUserData} />;

  const hasEnrolledCourses = enrollments.length > 0;

  return (
    <div>
      <h1 className="page-header">My Dashboard</h1>

      {/* Status Card - Removed bgColor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Enrolled Courses"
          value={enrollments.length}
          icon={BookOpen}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          icon={Clock}
        />
        <StatCard
          title="In Progress"
          value={
            enrollments.filter((e) => e.progress > 0 && e.progress < 100).length
          }
          icon={BookOpen}
        />
      </div>

      <CoursesShowcase />

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Pending Enrollment Requests
          </h2>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.request_id || request.id || Math.random()}
                className="dash-card p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-foreground">
                    {request.course_title ||
                      request.package_title ||
                      request.title ||
                      "Course"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requested on:{" "}
                    {request.created_at
                      ? new Date(request.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {request.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: {request.notes}
                    </p>
                  )}
                </div>
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">
                  Pending Approval
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enrolled Courses Section */}
      <h2 className="text-lg font-semibold text-foreground mb-4">My Courses</h2>

      {!hasEnrolledCourses ? (
        <div className="dash-card p-8 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            You are not enrolled in any course yet.
          </p>
          <Link to="/courses" className="btn-primary inline-block no-underline">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {enrollments.map((enrollment) => (
            <CourseCard
              key={enrollment.enrollment_id || enrollment.id || Math.random()}
              id={enrollment.course_id || enrollment.id}
              title={enrollment.title || "Untitled Course"}
              description={enrollment.description || ""}
              imageUrl={enrollment.image_url}
              teacherName={
                enrollment.teacher_first_name && enrollment.teacher_last_name
                  ? `${enrollment.teacher_first_name} ${enrollment.teacher_last_name}`
                  : enrollment.teacher_name || "Instructor"
              }
              progress={enrollment.progress || 0}
              showGoToCourse
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== TEACHER DASHBOARD ====================
function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [stats, setStats] = useState({
    courses: { total: 0, active: 0, pending: 0, rejected: 0 },
    lessons: { total: 0, avg_duration: 0 },
    students: { total: 0, total_enrollments: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // Fetch all required data in parallel
      const [coursesRes, statsRes, requestsRes] = await Promise.all([
        apiCall("/courses"),
        apiCall("/courses/stats/overview").catch(() => null),
        apiCall("/teachers/enrollments/requests").catch(() => ({ data: [] }))
      ]);

      setCourses(coursesRes.data || coursesRes || []);
      if (statsRes) setStats(statsRes.data || statsRes);
      setEnrollmentRequests(requestsRes.data || requestsRes || []);
    } catch (err: any) {
      console.error("Error fetching teacher data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (requestId: number, action: 'approve' | 'reject' | 'suspend') => {
    try {
      setActionLoading(`${requestId}-${action}`);
      const endpoint = `/enrollments/requests/${requestId}/${action}`;
      
      const body: any = { status: action.toUpperCase() === 'APPROVE' ? 'APPROVED' : action.toUpperCase() === 'REJECT' ? 'REJECTED' : 'SUSPENDED' };
      if (action === 'suspend') body.admin_notes = "Enrollment suspended by teacher.";

      await apiCall(endpoint, {
        method: "PUT",
        body: JSON.stringify(body)
      });

      // Refresh data
      await fetchData();
    } catch (err: any) {
      console.error(`Error performing ${action}:`, err);
      alert(`Failed to ${action}: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  // Real revenue calculation (only from approved requests)
  const totalRevenue = enrollmentRequests
    .filter((r: any) => r.status === 'APPROVED')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const totalStudents = stats.students?.total || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-header">Teacher Dashboard</h1>
        <p className="text-muted-foreground -mt-4 mb-6">Manage your courses, students, and earnings from one central hub.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={totalStudents} icon={Users} />
        <StatCard
          title="Total Earnings"
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
        />
        <StatCard
          title="Active Courses"
          value={courses.filter((c: any) => c.status === "APPROVED").length}
          icon={BookOpen}
        />
        <StatCard
          title="Pending Courses"
          value={courses.filter((c: any) => c.status === "PENDING").length}
          icon={Clock}
        />
      </div>

      {/* Enrollment Requests Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Student Enrollment Requests</h2>
          <span className="text-sm text-muted-foreground mr-2">{enrollmentRequests.length} Total Requests</span>
        </div>
        
        <div className="dash-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-4 uppercase tracking-wider">Student Name & Phone</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-4 uppercase tracking-wider">Email</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-4 uppercase tracking-wider">Course</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground p-4 uppercase tracking-wider">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground p-4 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enrollmentRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No enrollment requests found.
                    </td>
                  </tr>
                ) : (
                  enrollmentRequests.map((request: any) => (
                    <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground uppercase">{request.first_name} {request.last_name}</span>
                          <span className="text-xs text-muted-foreground mt-1">{request.phone || 'No phone'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{request.email}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium">{request.course_title}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Amt: ${Number(request.amount).toFixed(2)}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          request.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          request.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {request.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleAction(request.id, 'approve')}
                                disabled={actionLoading !== null}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
                              >
                                {actionLoading === `${request.id}-approve` ? '...' : 'Approve'}
                              </button>
                              <button 
                                onClick={() => handleAction(request.id, 'reject')}
                                disabled={actionLoading !== null}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                              >
                                {actionLoading === `${request.id}-reject` ? '...' : 'Reject'}
                              </button>
                            </>
                          )}
                          {request.status === 'APPROVED' && (
                            <button 
                              onClick={() => handleAction(request.id, 'suspend')}
                              disabled={actionLoading !== null}
                              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs font-medium transition-colors"
                            >
                              {actionLoading === `${request.id}-suspend` ? '...' : 'Suspend'}
                            </button>
                          )}
                          {(request.status === 'REJECTED' || request.status === 'SUSPENDED') && (
                            <button 
                              onClick={() => handleAction(request.id, 'approve')}
                              disabled={actionLoading !== null}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                            >
                              {actionLoading === `${request.id}-approve` ? '...' : 'Re-Approve'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">My Courses</h2>
          <Link to="/admin/addcourse" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
            <Plus className="h-4 w-4" /> Add New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="dash-card p-12 text-center">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Courses Created</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Ready to share your knowledge with the world? Start by creating your first course today!
            </p>
            <Link to="/admin/addcourse" className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <div key={course.id} className="dash-card group overflow-hidden border border-border flex flex-col hover:border-primary/30 transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      course.status === 'APPROVED' ? 'bg-green-500 text-white' :
                      course.status === 'PENDING' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg line-clamp-1 mb-1">{course.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{course.enrollments_count || 0} Students</span>
                    </div>
                    <div className="font-bold text-primary text-base">
                      ${Number(course.price).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Link to={`/courses/${course.id}/edit`} className="flex-1 px-3 py-2 bg-muted hover:bg-muted/80 rounded text-center text-xs font-semibold no-underline text-foreground">
                      Edit Course
                    </Link>
                    <Link to={`/courses/${course.id}`} className="flex-1 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded text-center text-xs font-semibold no-underline">
                      View Page
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard() {
  const [stats, setStats] = useState({
    summary: {
      total_users: 0,
      students: 0,
      teachers: 0,
      admins: 0,
      active_users: 0,
      new_today: 0,
      new_this_week: 0,
      new_this_month: 0,
    },
    teacher_requests: {
      total_requests: 0,
      pending_requests: 0,
      approved_teachers: 0,
      rejected_requests: 0,
    },
    top_enrolled_students: [],
    top_teachers: [],
    recent_users: [],
  });
  const [courseStats, setCourseStats] = useState({
    summary: {
      total_courses: 0,
      pending_courses: 0,
      approved_courses: 0,
      rejected_courses: 0,
    },
    top_courses: [],
    recent_courses: [],
  });
  const [enrollmentStats, setEnrollmentStats] = useState({
    enrollments: {
      total_enrollments: 0,
      total_students: 0,
    },
    requests: {
      total_requests: 0,
      pending_requests: 0,
      approved_requests: 0,
      rejected_requests: 0,
    },
    popular_courses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fetch all stats in parallel for better performance
      const [userStatsData, courseStatsData, enrollmentStatsData] =
        await Promise.allSettled([
          apiCall("/users/stats/dashboard"),
          apiCall("/courses/stats/overview"),
          apiCall("/enrollments/stats"),
        ]);

      if (userStatsData.status === "fulfilled") {
        const uData = userStatsData.value.data || userStatsData.value;
        setStats({
          summary: uData.summary || {},
          teacher_requests: {
            pending_requests: uData.summary?.pending_approvals || 0,
            // Add other fields if needed from backend
          },
          top_enrolled_students: uData.top_enrolled_students || [],
          top_teachers: uData.active_teachers || [],
          recent_users: uData.recent_users || [],
        });
      }

      if (courseStatsData.status === "fulfilled") {
        const cData = courseStatsData.value.data || courseStatsData.value;
        setCourseStats({
          summary: cData.summary || {},
          top_courses: cData.popular_courses || [],
          recent_courses: cData.recent_courses || [],
        });
      }

      if (enrollmentStatsData.status === "fulfilled") {
        const eData = enrollmentStatsData.value.data || enrollmentStatsData.value;
        setEnrollmentStats({
          enrollments: {
            total_enrollments: eData.summary?.total_enrollments || 0,
            total_students: eData.summary?.unique_students || 0,
          },
          requests: {
            total_requests: eData.summary?.total_requests || 0,
            pending_requests: eData.summary?.pending_requests || 0,
            approved_requests: eData.summary?.approved_requests || 0,
            rejected_requests: eData.summary?.rejected_requests || 0,
          },
          popular_courses: eData.popular_courses || [],
        });
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAdminData} />;

  const pendingTotal =
    (stats.teacher_requests?.pending_requests || 0) +
    (enrollmentStats.requests?.pending_requests || 0);

  return (
    <div>
      <h1 className="page-header">Admin Dashboard</h1>

      {/* Main Stats Grid - Removed bgColor */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Users"
          value={stats.summary?.total_users || 0}
          icon={Users}
        />
        <StatCard
          title="Total Teachers"
          value={stats.summary?.teachers || 0}
          icon={GraduationCap}
        />
        <StatCard
          title="Total Courses"
          value={courseStats.summary?.total_courses || 0}
          icon={BookOpen}
        />
        <StatCard
          title="Pending Requests"
          value={pendingTotal}
          icon={ClipboardList}
        />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Users"
          value={stats.summary?.active_users || 0}
          icon={CheckCircle}
        />
        <StatCard
          title="New Today"
          value={stats.summary?.new_today || 0}
          icon={Clock}
        />
        <StatCard
          title="Pending Courses"
          value={courseStats.summary?.pending_courses || 0}
          icon={Clock}
        />
        <StatCard
          title="Total Enrollments"
          value={enrollmentStats.enrollments?.total_enrollments || 0}
          icon={Users}
        />
      </div>

      {/* Top Students and Teachers */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Top Enrolled Students */}
        <div className="dash-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Top Enrolled Students
          </h2>
          {!stats.top_enrolled_students ||
          stats.top_enrolled_students.length === 0 ? (
            <p className="text-muted-foreground text-sm">No data available</p>
          ) : (
            <div className="space-y-3">
              {stats.top_enrolled_students.map((student, index) => (
                <div
                  key={student.id || index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {student.total_enrollments} enrollments
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Teachers */}
        <div className="dash-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Top Teachers
          </h2>
          {!stats.top_teachers || stats.top_teachers.length === 0 ? (
            <p className="text-muted-foreground text-sm">No data available</p>
          ) : (
            <div className="space-y-3">
              {stats.top_teachers.map((teacher, index) => (
                <div
                  key={teacher.id || index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {teacher.first_name} {teacher.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {teacher.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {teacher.approved_courses || teacher.approved_packages || 0}{" "}
                    courses
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recent Users
        </h2>
        <div className="dash-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground p-3">
                  Name
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3">
                  Email
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3">
                  Role
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_users &&
                stats.recent_users.map((user) => (
                  <tr key={user.id} className="border-t border-border">
                    <td className="p-3 text-sm">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-3 text-sm">{user.email}</td>
                    <td className="p-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                            : user.role === "TEACHER"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dash-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/users"
            className="btn-primary text-sm px-4 py-2 no-underline"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/courses"
            className="btn-primary text-sm px-4 py-2 no-underline"
          >
            Manage Courses
          </Link>
          <Link
            to="/admin/approvals"
            className="btn-outline-primary text-sm px-4 py-2 no-underline"
          >
            Pending Approvals ({stats.teacher_requests?.pending_requests || 0})
          </Link>
          <Link
            to="/admin/enrollments"
            className="btn-outline-primary text-sm px-4 py-2 no-underline"
          >
            Enrollment Requests (
            {enrollmentStats.requests?.pending_requests || 0})
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard component with proper type handling
export default function Dashboard() {
  const { role } = useRole();

  return (
    <DashboardLayout>
      {role === "user" && <UserDashboard />}
      {role === "teacher" && <TeacherDashboard />}
      {role === "admin" && <AdminDashboard />}

      {/* Fallback for unknown roles */}
      {!["user", "teacher", "admin", "student"].includes(role) && (
        <div className="dash-card p-8 text-center">
          <p className="text-muted-foreground">
            Unknown user role ({role}). Please contact support.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
