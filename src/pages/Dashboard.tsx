import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRole } from "@/contexts/RoleContext";
import { userEnrolledCourses, dummyCourses, dummyUsers, dummyEnrollmentRequests } from "@/data/dummyData";
import StatCard from "@/components/StatCard";
import CourseCard from "@/components/CourseCard";
import { BookOpen, Users, GraduationCap, ClipboardList, DollarSign } from "lucide-react";

function UserDashboard() {
  const hasEnrolledCourses = userEnrolledCourses.length > 0;

  return (
    <div>
      <h1 className="page-header">My Dashboard</h1>

      <div className="dash-card p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-1">Status</p>
        <p className="text-foreground font-medium">✅ Logged in</p>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4">My Courses</h2>

      {!hasEnrolledCourses ? (
        <div className="dash-card p-8 text-center">
          <p className="text-muted-foreground mb-4">
            You are logged in, but you are not enrolled in any course yet.
          </p>
          <Link to="/courses" className="btn-primary inline-block no-underline">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {userEnrolledCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              showGoToCourse
              onGoToCourse={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TeacherDashboard() {
  const teacherCourses = dummyCourses.filter((c) => c.teacherName === "Carol Williams");
  const totalStudents = teacherCourses.reduce((s, c) => s + c.studentsCount, 0);
  const totalRevenue = teacherCourses.reduce((s, c) => s + c.revenue, 0);

  return (
    <div>
      <h1 className="page-header">Teacher Dashboard</h1>
      <p className="text-muted-foreground -mt-4 mb-6">Welcome back, Carol Williams</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Students" value={totalStudents} icon={Users} />
        <StatCard title="Total Revenue" value={`$${totalRevenue}`} icon={DollarSign} />
        <StatCard title="My Courses" value={teacherCourses.length} icon={BookOpen} />
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4">My Courses</h2>
      <div className="space-y-3">
        {teacherCourses.map((course) => (
          <div key={course.id} className="dash-card flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm">{course.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {course.studentsCount} students · ${course.revenue} revenue
              </p>
            </div>
            <Link to="/students" className="btn-outline-primary text-xs px-3 py-1.5 no-underline">
              View Students
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const totalUsers = dummyUsers.length;
  const totalTeachers = dummyUsers.filter((u) => u.role === "teacher").length;
  const totalCourses = dummyCourses.length;
  const pendingRequests = dummyEnrollmentRequests.filter((r) => r.status === "pending").length;

  return (
    <div>
      <h1 className="page-header">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totalUsers} icon={Users} />
        <StatCard title="Total Teachers" value={totalTeachers} icon={GraduationCap} />
        <StatCard title="Total Courses" value={totalCourses} icon={BookOpen} />
        <StatCard title="Pending Requests" value={pendingRequests} icon={ClipboardList} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { role } = useRole();

  return (
    <DashboardLayout>
      {role === "user" && <UserDashboard />}
      {role === "teacher" && <TeacherDashboard />}
      {role === "admin" && <AdminDashboard />}
    </DashboardLayout>
  );
}
