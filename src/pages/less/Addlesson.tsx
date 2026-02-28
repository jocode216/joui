import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiCall } from "@/lib/api";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface Course {
  id: number;
  title: string;
  status: string;
}

export default function AddLesson() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    order_index: 1,
    is_free: false
  });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await apiCall(`/courses/${courseId}`);
      const courseData = data.data || data;
      
      if (courseData.status !== "APPROVED") {
        setError("Lessons can only be added to approved courses");
        setCourse(courseData);
      } else {
        setCourse(courseData);
        // Get current lesson count for default order
        try {
          const lessonsData = await apiCall(`/courses/${courseId}/lessons`);
          const count = Array.isArray(lessonsData.data || lessonsData) 
            ? (lessonsData.data || lessonsData).length 
            : 0;
          setFormData(prev => ({ ...prev, order_index: count + 1 }));
        } catch {
          setFormData(prev => ({ ...prev, order_index: 1 }));
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    setSubmitting(true);
    setError("");
    
    try {
      await apiCall("/lessons", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          course_id: Number(courseId)
        })
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate(`/teacher/courses/${courseId}/lessons`);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="dash-card p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-destructive">Course Not Found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate(`/courses/${courseId}/lessons`)}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
          <h1 className="page-header mb-0">Add Lesson</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-green-600">Lesson created successfully!</p>
          </div>
        )}

        <div className="dash-card p-6">
          <div className="mb-4 p-3 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Course</p>
            <p className="font-medium">{course.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                placeholder="Lesson title"
                required
                disabled={course.status !== "APPROVED"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background resize-none"
                placeholder="Lesson description..."
                disabled={course.status !== "APPROVED"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Video URL</label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                placeholder="https://youtube.com/..."
                disabled={course.status !== "APPROVED"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  min={1}
                  disabled={course.status !== "APPROVED"}
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    className="rounded border-input"
                    disabled={course.status !== "APPROVED"}
                  />
                  <span className="text-sm">Free preview</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/teacher/courses/${courseId}/lessons`)}
                className="btn-outline-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || course.status !== "APPROVED"}
                className="btn-primary"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Lesson"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
