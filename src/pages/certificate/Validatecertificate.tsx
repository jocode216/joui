import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { Award, CheckCircle, XCircle, Search, ArrowLeft } from "lucide-react";

interface CertificateData {
  id: number;
  certificate_id: string;
  full_name: string;
  image_url: string;
  created_at: string;
  issued_at: string;
  first_name: string;
  last_name: string;
  email: string;
  course_id?: number;
  course_title?: string;
}

export default function Validatecertificate() {
  const { certificateId: urlCertificateId } = useParams<{ certificateId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get ID from either URL param or query param
  const idFromUrl = urlCertificateId || searchParams.get("id") || "";
  
  const [certificateId, setCertificateId] = useState(idFromUrl);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const baseUrl = "http://localhost:3000/api";

  // Auto-validate when certificate ID is in URL
  useEffect(() => {
    if (idFromUrl) {
      setCertificateId(idFromUrl);
      validateCertificate(idFromUrl);
    } else {
      // Reset when no ID in URL
      setCertificate(null);
      setError("");
      setSearched(false);
    }
  }, [idFromUrl]);

  const validateCertificate = async (id: string) => {
    if (!id.trim()) return;
    
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      console.log(`Validating certificate: ${baseUrl}/certificates/${id.trim()}`);
      
      const response = await fetch(`${baseUrl}/certificates/${id.trim()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Certificate not found");
      }

      setCertificate(result.data);
    } catch (err) {
      console.error("Validation error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (certificateId.trim()) {
      // Navigate to clean URL with /c/ prefix for certificate verification
      navigate(`/c/${certificateId.trim()}`, { replace: true });
    }
  };

  const handleBackToSearch = () => {
    navigate("/validate-certificate");
  };

  // Determine if we're in "search mode" (no certificate ID in URL)
  const isSearchMode = !idFromUrl;

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-foreground">
              Jocode
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground">
                Courses
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12">
        <div className="max-w-2xl mx-auto">
        {/* Back button when viewing a certificate */}
        {!isSearchMode && certificate && (
          <button
            onClick={handleBackToSearch}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </button>
        )}

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Verify Certificate</h1>
          <p className="text-muted-foreground mt-2">
            {isSearchMode 
              ? "Enter a certificate ID to verify authenticity"
              : "Certificate validation result"}
          </p>
        </div>

        {/* Search Form - Only show in search mode */}
        {isSearchMode && (
          <div className="dash-card p-6 mb-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Enter certificate ID (e.g., JOCD-XXXX-XXXX)"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !certificateId.trim()}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verifying certificate...</p>
          </div>
        )}

        {/* Error State */}
        {error && searched && !loading && (
          <div className="dash-card p-8 text-center border-destructive/20">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-destructive mb-2">Invalid Certificate</h2>
            <p className="text-muted-foreground">{error}</p>
            {!isSearchMode && (
              <button
                onClick={handleBackToSearch}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Try Another Certificate
              </button>
            )}
          </div>
        )}

        {/* Success State */}
        {certificate && !loading && (
          <div className="dash-card p-8 border-green-500/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-1">
                Valid Certificate
              </h2>
              <p className="text-sm text-muted-foreground">
                This certificate is authentic and verified
              </p>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Certificate ID
                  </p>
                  <p className="text-sm font-mono font-medium break-all">
                    {certificate.certificate_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Issue Date
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(certificate.issued_at || certificate.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {certificate.course_title && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Course
                  </p>
                  <p className="text-sm font-medium">{certificate.course_title}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Recipient
                </p>
                <p className="text-sm font-medium">{certificate.full_name}</p>
                <p className="text-xs text-muted-foreground">{certificate.email}</p>
              </div>

              {certificate.image_url && (
                <div className="pt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Certificate
                  </p>
                  <img
                    src={certificate.image_url}
                    alt="Certificate"
                    className="max-w-full h-auto rounded-lg border border-input shadow-sm"
                  />
                  <a
                    href={certificate.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    View Full Size
                  </a>
                </div>
              )}

              {/* Shareable Link Info */}
              <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Share this certificate using this link:
                </p>
                <p className="text-sm font-mono break-all">
                  {window.location.origin}/c/{certificate.certificate_id}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Jocode. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}