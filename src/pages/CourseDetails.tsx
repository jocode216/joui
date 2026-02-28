import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { apiCall, formatPrice, formatDate, getCurrentUser } from "@/lib/api";
import { BookOpen, Clock, User, DollarSign, PlayCircle, Lock, CheckCircle } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  status: string;
  teacher_first_name: string;
  teacher_last_name: string;
  teacher_id: number;
  created_at: string;
  lessons_count?: number;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  order_index: number;
  is_free: boolean;
}

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getCurrentUser();

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const courseData = await apiCall(`/courses/${id}`);
      setCourse(courseData.data || courseData);

      // Fetch lessons
      try {
        const lessonsData = await apiCall(`/courses/${id}/lessons`);
        setLessons(lessonsData.data || lessonsData || []);
      } catch {
        setLessons([]);
      }

      // Check enrollment status if logged in
      if (user) {
        try {
          const statusData = await apiCall(`/courses/${id}/enrollment-status`);
          setEnrollmentStatus(statusData.data?.status || statusData.status || null);
        } catch {
          setEnrollmentStatus(null);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="dash-card p-8">
            <p className="text-destructive mb-4">{error || "Course not found"}</p>
            <Link to="/courses" className="btn-primary no-underline">Browse Courses</Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const teacherName = `${course.teacher_first_name || ""} ${course.teacher_last_name || ""}`.trim() || "Instructor";
  const isFree = !course.price || course.price === 0;
  const isEnrolled = enrollmentStatus === "ENROLLED" || enrollmentStatus === "APPROVED";
  const isPending = enrollmentStatus === "PENDING";

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">&larr; Back to Courses</Link>

        {/* Course Header */}
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Image */}
          <div className="md:col-span-2">
            <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border">
              {course.image_url ? (
                <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status={course.status} />
              {isFree && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Free</span>}
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-3">{course.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{teacherName}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{lessons.length} lessons</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" />{formatPrice(course.price)}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{formatDate(course.created_at)}</span>
            </div>

            {course.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">{course.description}</p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {!user ? (
                <Link to="/login" className="btn-primary no-underline">Login to Enroll</Link>
              ) : isEnrolled ? (
                <Link to={`/courses/${id}/lessons`} className="btn-primary no-underline flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Continue Learning
                </Link>
              ) : isPending ? (
                <span className="badge-pending text-sm px-4 py-2">Enrollment Pending</span>
              ) : isFree ? (
                <button
                  onClick={async () => {
                    try {
                      await apiCall("/enrollments/request", {
                        method: "POST",
                        body: JSON.stringify({ course_id: Number(id) }),
                      });
                      // Backend auto-approves free courses — set ENROLLED directly
                      setEnrollmentStatus("ENROLLED");
                    } catch (err: any) {
                      setError(err.message);
                    }
                  }}
                  className="btn-primary"
                >
                  Enroll Now — Free
                </button>
              ) : (
                <Link to={`/courses/${id}/enroll`} className="btn-primary no-underline">
                  Request Enrollment — {formatPrice(course.price)}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="dash-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Course Lessons ({lessons.length})</h2>

          {lessons.length === 0 ? (
            <p className="text-muted-foreground text-sm">No lessons available yet.</p>
          ) : (
            <div className="space-y-2">
              {lessons.sort((a, b) => a.order_index - b.order_index).map((lesson, idx) => (
                <div key={lesson.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <span className="text-sm font-medium text-muted-foreground w-8 text-center">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {lesson.is_free ? (
                        <PlayCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="text-sm font-medium text-foreground truncate">{lesson.title}</span>
                      {lesson.is_free && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700">FREE</span>
                      )}
                    </div>
                    {lesson.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{lesson.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
