import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiCall, uploadToImgBB } from "@/lib/api";
import { Loader2, Upload, ArrowLeft, CheckCircle } from "lucide-react";

export default function CourseEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", description: "", price: "", image_url: "",
  });

  useEffect(() => { fetchCourse(); }, [id]);

  const fetchCourse = async () => {
    try {
      const data = await apiCall(`/courses/${id}`);
      const course = data.data || data;
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price?.toString() || "",
        image_url: course.image_url || "",
      });
      if (course.image_url) setImagePreview(course.image_url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setUploadingImage(true);
    const url = await uploadToImgBB(file);
    if (url) setFormData((p) => ({ ...p, image_url: url }));
    else setError("Failed to upload image");
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { setError("Title is required"); return; }
    setSubmitting(true);
    setError("");
    try {
      const submitData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
      };
      await apiCall(`/courses/${id}`, { method: "PUT", body: JSON.stringify(submitData) });
      setSuccess(true);
      setTimeout(() => navigate("/my-courses"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
      <Link to="/my-courses" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to My Courses
      </Link>
      <h1 className="page-header mb-6">Edit Course</h1>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <p className="text-sm text-emerald-700 dark:text-emerald-400">Course updated! Redirecting...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="dash-card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Course Title <span className="text-destructive">*</span></label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={5} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Price ($)</label>
          <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" min="0" step="0.01" placeholder="0 for free" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Course Image</label>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={handleFileChange} className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" disabled={uploadingImage} />
            {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
          </div>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-3 h-40 rounded-lg border border-border object-cover" />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/my-courses" className="btn-outline-secondary no-underline">Cancel</Link>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span> : "Save Changes"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
