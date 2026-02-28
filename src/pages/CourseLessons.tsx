import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiCall } from "@/lib/api";
import { Plus, Edit, Trash2, Eye, GripVertical, PlayCircle, Lock, Loader2 } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  order_index: number;
  is_free: boolean;
}

export default function CourseLessons() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const courseData = await apiCall(`/courses/${id}`);
      setCourseTitle((courseData.data || courseData).title || "Course");
      const lessonsData = await apiCall(`/courses/${id}/lessons`);
      setLessons(Array.isArray(lessonsData.data || lessonsData) ? (lessonsData.data || lessonsData).sort((a: Lesson, b: Lesson) => a.order_index - b.order_index) : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    navigate(`/teacher/courses/${id}/lessons/add`);
  };

  const openEdit = (lesson: Lesson) => {
    navigate(`/teacher/courses/${id}/lessons/${lesson.id}/edit`);
  };

  const openView = (lesson: Lesson) => {
    navigate(`/teacher/courses/${id}/lessons/${lesson.id}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiCall(`/lessons/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Link to="/teacher/lessons" className="text-sm text-muted-foreground hover:text-foreground">&larr; Back to Lesson Dashboard</Link>
          <h1 className="page-header mb-0 mt-1">Lesson Management</h1>
          <p className="text-sm text-muted-foreground">{courseTitle} • {lessons.length} lessons</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Lesson
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="dash-card p-12 text-center">
          <PlayCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No lessons yet. Add your first lesson to get started.</p>
          <button onClick={openAdd} className="btn-primary">Add First Lesson</button>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="dash-card p-4 flex items-center gap-4">
              <GripVertical className="w-5 h-5 text-muted-foreground shrink-0 cursor-grab" />
              <span className="text-sm font-bold text-muted-foreground w-8 text-center">{lesson.order_index}</span>
              {lesson.is_free ? (
                <PlayCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{lesson.title}</p>
                {lesson.description && <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>}
              </div>
              {lesson.is_free && <span className="badge-approved text-[10px]">FREE</span>}
              <div className="flex gap-1">
                <button onClick={() => openView(lesson)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="View">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => openEdit(lesson)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Edit">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => setDeleteId(lesson.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Delete Lesson</h2>
            <p className="text-muted-foreground mb-4">Are you sure you want to delete this lesson? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline-secondary">Cancel</button>
              <button onClick={handleDelete} className="btn-destructive">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
