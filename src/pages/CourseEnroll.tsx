import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/dataIhave/footer/Footer";
import { apiCall, uploadToImgBB, formatPrice } from "@/lib/api";
import { Loader2, Upload, CheckCircle, BookOpen, ArrowLeft } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  teacher_first_name: string;
  teacher_last_name: string;
}

export default function CourseEnroll() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const data = await apiCall(`/courses/${id}`);
      setCourse(data.data || data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file"); return; }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to ImgBB
    setUploadingImage(true);
    const url = await uploadToImgBB(file);
    if (url) {
      setPaymentScreenshot(url);
    } else {
      setError("Failed to upload payment screenshot");
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) { setError("Please accept the terms"); return; }

    setSubmitting(true);
    setError("");

    try {
      const body: any = { course_id: Number(id) };
      if (paymentScreenshot) body.payment_screenshot = paymentScreenshot;
      if (transactionId) body.transaction_id = transactionId;
      if (notes) body.notes = notes;

      await apiCall("/enrollments/request", {
        method: "POST",
        body: JSON.stringify(body),
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit enrollment request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="dash-card p-8">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground mb-6">Your enrollment request has been submitted and is pending approval.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/my-requests" className="btn-primary no-underline">View My Requests</Link>
              <Link to="/courses" className="btn-outline-primary no-underline">Browse More Courses</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isFree = !course?.price || course.price === 0;

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to={`/courses/${id}`} className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Course
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-6">Enrollment Request</h1>

        {/* Course Summary Card */}
        <div className="dash-card p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {course?.image_url ? (
                <img src={course.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{course?.title}</h3>
              <p className="text-sm text-muted-foreground">
                {course?.teacher_first_name} {course?.teacher_last_name}
              </p>
              <p className="text-lg font-bold text-primary mt-1">{formatPrice(course?.price)}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Section (only for paid courses) */}
          {!isFree && (
            <div className="dash-card p-5 space-y-4">
              <h3 className="font-semibold text-foreground">Payment Details</h3>

              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-sm text-foreground">Amount to pay: <strong className="text-primary">{formatPrice(course?.price)}</strong></p>
              </div>

              {/* Payment Screenshot */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Payment Screenshot</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                </div>
                {imagePreview && (
                  <img src={imagePreview} alt="Payment proof" className="mt-2 h-32 rounded-lg border border-border object-cover" />
                )}
                {paymentScreenshot && (
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Uploaded successfully</p>
                )}
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Transaction ID (optional)</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g., TXN-12345"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Any additional information..."
            />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 rounded border-input"
            />
            <span className="text-sm text-muted-foreground">
              I agree to the enrollment terms and understand that my request will be reviewed by the instructor.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting || !termsAccepted}
            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</span>
            ) : (
              "Submit Enrollment Request"
            )}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
