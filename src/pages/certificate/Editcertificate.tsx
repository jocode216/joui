import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface CertificateData {
  id: number;
  certificate_id: string;
  user_id: number;
  full_name: string;
  image_url: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function Editcertificate() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [fullName, setFullName] = useState("");
  const [certificateImage, setCertificateImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const baseUrl = "http://localhost:3000/api";

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`${baseUrl}/certificates/${certificateId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch certificate");
        }

        setCertificate(result.data);
        setFullName(result.data.full_name);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      
      // Note: Your backend doesn't have an update endpoint yet
      // You'll need to create one or use delete + create
      // For now, we'll show a message
      
      setSuccess("Update functionality coming soon!");
      
      // Simulate update
      setTimeout(() => {
        navigate("/admin/certificates");
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading certificate...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!certificate) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive">Certificate not found</p>
            <button
              onClick={() => navigate("/admin/certificates")}
              className="btn-primary mt-4 px-4 py-2"
            >
              Back to Certificates
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="dash-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Edit Certificate
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
            <div className="bg-accent/30 p-4 rounded-lg mb-4">
              <p className="text-sm">
                <span className="font-medium">Certificate ID:</span>{' '}
                <span className="font-mono">{certificate.certificate_id}</span>
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">User:</span> {certificate.first_name} {certificate.last_name} ({certificate.email})
              </p>
            </div>

            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Full Name on Certificate
              </label>
              <input
                type="text"
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="certificateImgurl"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Update Certificate Image (Optional)
              </label>
              <input
                type="file"
                id="certificateImgurl"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {certificate.image_url && !imagePreview && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Current Certificate:</p>
                  <img
                    src={certificate.image_url}
                    alt="Current certificate"
                    className="max-w-full h-auto max-h-48 rounded-lg border border-input"
                  />
                </div>
              )}

              {imagePreview && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">New Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Certificate preview"
                    className="max-w-full h-auto max-h-48 rounded-lg border border-input"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={updating}
              >
                {updating ? (
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
                    Updating...
                  </span>
                ) : (
                  "Update Certificate"
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
