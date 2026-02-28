import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/dataIhave/footer/Footer";
import { apiCall, formatDate } from "@/lib/api";
import { Award, CheckCircle, XCircle, User, BookOpen, Calendar } from "lucide-react";

interface CertificateData {
  id: number;
  certificate_id: string;
  student_name: string;
  course_title: string;
  issued_at: string;
  student_first_name: string;
  student_last_name: string;
}

export default function CertificateVerify() {
  const { id } = useParams<{ id: string }>();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => { verify(); }, [id]);

  const verify = async () => {
    try {
      const data = await apiCall(`/certificates/${id}`);
      setCertificate(data.data || data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-lg mx-auto px-4 py-16">
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : notFound ? (
          <div className="dash-card p-8 text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Certificate Not Found</h2>
            <p className="text-muted-foreground mb-4">This certificate ID is invalid or does not exist.</p>
            <p className="text-xs font-mono text-muted-foreground mb-6">ID: {id}</p>
            <Link to="/" className="btn-primary no-underline">Go Home</Link>
          </div>
        ) : certificate ? (
          <div className="dash-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Certificate Verified</h2>
            <p className="text-sm text-emerald-600 font-medium mb-6">This certificate is authentic and valid.</p>

            <div className="bg-muted/50 rounded-xl p-6 text-left space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Issued to</p>
                  <p className="font-medium text-foreground">{certificate.student_name || `${certificate.student_first_name} ${certificate.student_last_name}`}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Course</p>
                  <p className="font-medium text-foreground">{certificate.course_title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Issued on</p>
                  <p className="font-medium text-foreground">{formatDate(certificate.issued_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Certificate ID</p>
                  <p className="font-mono text-sm text-foreground">{certificate.certificate_id}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
