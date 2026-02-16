import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRole } from "@/contexts/RoleContext";
import CourseCard from "@/components/CourseCard";
import { userEnrolledCourses, dummyCourses } from "@/data/dummyData";
import { Link } from "react-router-dom";

export default function MyCourses() {
  const { role } = useRole();

  const courses =
    role === "teacher"
      ? dummyCourses.filter((c) => c.teacherName === "Carol Williams")
      : userEnrolledCourses;

  return (
    <DashboardLayout>
      <h1 className="page-header">My Courses</h1>

      {courses.length === 0 ? (
        <div className="dash-card p-8 text-center">
          <p className="text-muted-foreground mb-4">You have no courses yet.</p>
          <Link to="/courses" className="btn-primary inline-block no-underline">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              teacherName={role === "user" ? course.teacherName : undefined}
              showGoToCourse={role === "user"}
              onGoToCourse={() => {}}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
