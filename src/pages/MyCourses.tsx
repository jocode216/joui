import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRole } from "@/contexts/RoleContext";
import StatusBadge from "@/components/StatusBadge";
import { apiCall, formatDate, formatPrice, getCurrentUser } from "@/lib/api";
import { BookOpen, Users, Edit2, ListVideo, Plus } from "lucide-react";

interface Enrollment {
  id: number;
  course_id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  teacher_first_name: string;
  teacher_last_name: string;
  enrolled_at: string;
  completed_at: string | null;
  total_lessons: number;
}

interface TeacherCourse {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  status: string;
  lessons_count: number;
  enrolled_students: number;
  created_at: string;
}

export default function MyCourses() {
  const { role } = useRole();
  const user = getCurrentUser();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [teacherCourses, setTeacherCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [role]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (role === "teacher" || role === "admin") {
        // Teachers: use the teacher-specific endpoint to get only their own courses
        if (user && role === "teacher") {
          const data = await apiCall(`/teachers/${user.userId}/courses`);
          setTeacherCourses(data.data || data || []);
        } else {
          // Admin sees all courses
          const data = await apiCall("/courses");
          setTeacherCourses(data.data || data || []);
        }
      } else {
        // Students: GET /users/me/enrollments
        const data = await apiCall("/users/me/enrollments");
        setEnrollments(data.data || data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </DashboardLayout>
  );

  const isTeacher = role === "teacher" || role === "admin";

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-header mb-0">My Courses</h1>
        {isTeacher && (
          <Link to="/admin/addcourse" className="btn-primary no-underline flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Course
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Teacher View */}
      {isTeacher ? (
        teacherCourses.length === 0 ? (
          <div className="dash-card p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You haven't created any courses yet.</p>
            <Link to="/admin/addcourse" className="btn-primary inline-block no-underline">Create Your First Course</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {teacherCourses.map((course) => (
              <div key={course.id} className="dash-card p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Image */}
                <div className="w-24 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {course.image_url ? (
                    <img src={course.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{course.title}</h3>
                    <StatusBadge status={course.status} />
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><ListVideo className="w-3 h-3" />{course.lessons_count || 0} lessons</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolled_students || 0} students</span>
                    <span>{formatPrice(course.price)}</span>
                    <span>{formatDate(course.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <Link to={`/courses/${course.id}/lessons`} className="btn-outline-primary text-xs px-3 py-1.5 no-underline flex items-center gap-1">
                    <ListVideo className="w-3 h-3" /> Lessons
                  </Link>
                  <Link to={`/courses/${course.id}/edit`} className="btn-outline-secondary text-xs px-3 py-1.5 no-underline flex items-center gap-1">
                    <Edit2 className="w-3 h-3" /> Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Student View */
        enrollments.length === 0 ? (
          <div className="dash-card p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You are not enrolled in any courses yet.</p>
            <Link to="/courses" className="btn-primary inline-block no-underline">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="dash-card overflow-hidden group hover:border-primary/30 transition-colors">
                {/* Image */}
                <div className="aspect-video bg-muted overflow-hidden">
                  {enrollment.image_url ? (
                    <img src={enrollment.image_url} alt={enrollment.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-10 h-10 text-muted-foreground" /></div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 truncate">{enrollment.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {enrollment.teacher_first_name} {enrollment.teacher_last_name} · {enrollment.total_lessons || 0} lessons
                  </p>

                  {enrollment.completed_at ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Completed</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">In Progress</span>
                  )}

                  <div className="mt-3">
                    <Link
                      to={`/courses/${enrollment.course_id}`}
                      className="btn-primary w-full text-center no-underline block text-sm"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </DashboardLayout>
  );
}
