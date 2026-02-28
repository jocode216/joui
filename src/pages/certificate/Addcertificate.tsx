import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRole } from "@/contexts/RoleContext";
import { uploadToImgBB } from "@/lib/api";
import { Loader2, CheckCircle, X, Image as ImageIcon } from "lucide-react";

interface FormData {
  user_id: string;
  course_id: string;
  full_name: string;
  certificate_id?: string;
  image_url: string;
}

export default function Addcertificate() {
  const [formData, setFormData] = useState<FormData>({
    user_id: "",
    course_id: "",
    full_name: "",
    certificate_id: "",
    image_url: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { user } = useRole();
  const baseUrl = "http://localhost:3000/api";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      setError("Image must be less than 32MB");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-upload to ImgBB
    setUploadingImage(true);
    setError("");
    const url = await uploadToImgBB(file);
    setUploadingImage(false);

    if (url) {
      setFormData(prev => ({ ...prev, image_url: url }));
    } else {
      setError("Failed to upload image. You can paste a URL directly below.");
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in");
      }

      if (!formData.image_url) {
        throw new Error("Please upload a certificate image");
      }

      const response = await fetch(`${baseUrl}/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create certificate");
      }

      setSuccess("Certificate created successfully!");
      
      // Reset form
      setFormData({
        user_id: "",
        course_id: "",
        full_name: "",
        certificate_id: "",
        image_url: ""
      });
      setImagePreview(null);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin/certificates");
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="dash-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Add New Certificate
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="user_id"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                User ID <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter user ID"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Enter the ID of the user who completed the course
              </p>
            </div>

            <div>
              <label
                htmlFor="course_id"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Course ID <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                id="course_id"
                name="course_id"
                value={formData.course_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter course ID"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Enter the ID of the completed course
              </p>
            </div>

            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter full name for certificate"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                This name will appear on the certificate
              </p>
            </div>

            <div>
              <label
                htmlFor="certificate_id"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Certificate ID (Optional)
              </label>
              <input
                type="text"
                id="certificate_id"
                name="certificate_id"
                value={formData.certificate_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Leave empty for auto-generated ID"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                If left empty, a unique ID will be generated automatically (JOCD-XXXX-XXXX)
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Certificate Image <span className="text-destructive">*</span>
              </label>

              {/* File picker */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading…
                  </div>
                )}
              </div>

              {/* Preview */}
              {imagePreview && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {formData.image_url ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">
                        {formData.image_url ? "Image ready" : "Uploading…"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="h-8 w-8 p-0 flex items-center justify-center rounded hover:bg-accent"
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <img
                    src={imagePreview}
                    alt="Certificate preview"
                    className="h-48 w-full rounded-md object-contain border"
                  />
                </div>
              )}

              {/* Manual URL fallback */}
              <div className="space-y-1">
                <label htmlFor="image_url" className="text-sm text-muted-foreground">
                  Or paste an image URL directly:
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="url"
                    id="image_url"
                    name="image_url"
                    placeholder="https://example.com/certificate.jpg"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    disabled={uploadingImage}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || uploadingImage || !formData.image_url}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Certificate"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/certificates")}
                className="px-6 py-3 rounded-lg border border-input bg-background text-foreground text-sm font-medium hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
