import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRole } from "@/contexts/RoleContext";
import { apiCall } from "@/lib/api";
import { 
  Award, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle, 
  XCircle,
  Download,
  ExternalLink,
  ChevronRight,
  Users,
  Clock
} from "lucide-react";

interface Certificate {
  id: number;
  certificate_id: string;
  user_id: number;
  full_name: string;
  image_url: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface CertificateStats {
  total: number;
  issuedThisMonth: number;
  pendingIssuance: number;
  verifiedToday: number;
}

export default function Certificate() {
  const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<CertificateStats>({
    total: 0,
    issuedThisMonth: 0,
    pendingIssuance: 0,
    verifiedToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { role } = useRole();
  const navigate = useNavigate();
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';
  const canManage = isAdmin || isTeacher;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent certificates
      const certResponse = await apiCall("/certificates?limit=5");
      const certificates = certResponse.data || [];
      setRecentCertificates(certificates);

      // Calculate stats
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const issuedThisMonth = certificates.filter((cert: Certificate) => 
        new Date(cert.created_at) >= firstDayOfMonth
      ).length;

      setStats({
        total: certResponse.pagination?.total || certificates.length,
        issuedThisMonth,
        pendingIssuance: 12, // This would come from a real endpoint
        verifiedToday: 8 // This would come from a real endpoint
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClick = () => {
    navigate("/validate-certificate");
  };

  const quickActions = [
    ...(canManage ? [{
      title: "Issue New Certificate",
      description: "Create and issue a new certificate",
      icon: Plus,
      path: "/admin/certificates/add",
      color: "bg-primary/10 text-primary"
    }] : []),
    {
      title: "Verify Certificate",
      description: "Validate a certificate by ID",
      icon: Search,
      path: "/validate-certificate",
      color: "bg-blue-500/10 text-blue-500"
    },
    ...(canManage ? [{
      title: "Manage Certificates",
      description: "View and manage all certificates",
      icon: FileText,
      path: "/admin/certificates",
      color: "bg-purple-500/10 text-purple-500"
    }] : []),
    {
      title: "My Certificates",
      description: "View your earned certificates",
      icon: Award,
      path: "/my-certificates",
      color: "bg-green-500/10 text-green-500"
    }
  ];

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certificates</h1>
          <p className="text-muted-foreground mt-1">
            {canManage ? 'Manage and issue certificates' : 'View your certificates'}
          </p>
        </div>
        {canManage && (
          <Link
            to="/admin/certificates/add"
            className="btn-primary px-4 py-2 text-sm inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Issue New Certificate
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      {canManage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="dash-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Certificates</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="dash-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issued This Month</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.issuedThisMonth}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>

          <div className="dash-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Issuance</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.pendingIssuance}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="dash-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified Today</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.verifiedToday}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="dash-card p-5 hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                <action.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Certificates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {canManage ? 'Recently Issued Certificates' : 'Your Recent Certificates'}
          </h2>
          {canManage && (
            <Link 
              to="/admin/certificates" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {recentCertificates.length === 0 ? (
          <div className="dash-card p-12 text-center">
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No certificates yet</h3>
            <p className="text-muted-foreground text-sm">
              {canManage 
                ? 'Start issuing certificates to students who complete courses.'
                : 'Complete your enrolled courses to earn certificates.'}
            </p>
            {canManage && (
              <Link
                to="/admin/certificates/add"
                className="btn-primary mt-4 px-4 py-2 text-sm inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Issue First Certificate
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {recentCertificates.map((cert) => (
              <div key={cert.id} className="dash-card p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {cert.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {cert.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/users/${cert.user_id}`}
                        className="text-xs px-2 py-1 rounded bg-accent text-foreground hover:bg-accent/80 inline-flex items-center gap-1"
                      >
                        <Users className="w-3 h-3" />
                        View User
                      </Link>
                      <a
                        href={cert.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="font-mono">ID: {cert.certificate_id}</span>
                    <span>Issued: {new Date(cert.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}