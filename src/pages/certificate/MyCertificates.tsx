import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiCall } from "@/lib/api";
import { Award, ExternalLink, Download, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Certificate {
  id: number;
  certificate_id: string;
  course_title: string;
  course_id: number;
  issued_at: string;
  student_name: string;
  image_url?: string;
}

export default function MyCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { 
    fetchCertificates(); 
  }, []);

  const fetchCertificates = async () => {
    try {
      const data = await apiCall("/certificates/my-certificates");
      setCertificates(data.data || data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
          <p className="text-muted-foreground mt-1">
            You've earned {certificates.length} certificate{certificates.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/validate-certificate"
          className="px-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm font-medium hover:bg-accent inline-flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Verify a Certificate
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="dash-card p-12 text-center">
          <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No certificates yet</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Complete your enrolled courses to earn certificates. Each completed course grants you a verified certificate.
          </p>
          <Link
            to="/courses"
            className="btn-primary mt-6 px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="dash-card p-5 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{cert.course_title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Issued: {formatDate(cert.issued_at)}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                    ID: {cert.certificate_id}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                <Link
                  to={`/validate-certificate?id=${cert.certificate_id}`}
                  className="flex-1 text-xs px-3 py-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Verify
                </Link>
                {cert.image_url && (
                  <a
                    href={cert.image_url}
                    download
                    className="flex-1 text-xs px-3 py-1.5 rounded bg-accent text-foreground hover:bg-accent/80 inline-flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
