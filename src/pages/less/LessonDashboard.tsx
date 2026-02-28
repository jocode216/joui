import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiCall } from "@/lib/api";
import { Plus, BookOpen, Loader2, AlertCircle } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  status: string;
  teacher_id: number;
  lessons_count?: number;
}

export default function LessonDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedCourses();
  }, []);

  const fetchApprovedCourses = async () => {
    try {
      setLoading(true);
      // Fetch only approved courses that the teacher owns
      const data = await apiCall("/courses?status=APPROVED");
      const allCourses = data.data || data || [];
      
      // Filter courses with lesson counts
      const coursesWithLessons = await Promise.all(
        allCourses.map(async (course: Course) => {
          try {
            const lessonsData = await apiCall(`/courses/${course.id}/lessons`);
            return {
              ...course,
              lessons_count: Array.isArray(lessonsData.data || lessonsData) 
                ? (lessonsData.data || lessonsData).length 
                : 0
            };
          } catch {
            return { ...course, lessons_count: 0 };
          }
        })
      );
      
      setCourses(coursesWithLessons);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="page-header mb-0">Lesson Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage lessons for your approved courses
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="dash-card p-12 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Approved Courses
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            You need to have approved courses before you can add lessons. 
            Create a course and wait for admin approval.
          </p>
          <Link to="/admin/addcourse" className="btn-primary">
            Create New Course
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="dash-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <span className="badge-approved text-[10px]">APPROVED</span>
              </div>
              
              <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {course.description || "No description"}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>{course.lessons_count} lessons</span>
                <span>Course ID: {course.id}</span>
              </div>
              
              <button
                onClick={() => navigate(`/teacher/courses/${course.id}/lessons`)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Manage Lessons
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
