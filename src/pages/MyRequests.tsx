import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { apiCall, formatDate, formatPrice } from "@/lib/api";
import { Clock, BookOpen, X, AlertTriangle } from "lucide-react";

interface EnrollmentRequest {
  id: number;
  course_id: number;
  course_title: string;
  course_image_url: string;
  status: string;
  amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
}

export default function MyRequests() {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await apiCall("/users/me/enrollment-requests");
      setRequests(data.data || data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await apiCall(`/enrollments/requests/${cancelId}/cancel`, { method: "DELETE" });
      setRequests((prev) => prev.filter((r) => r.id !== cancelId));
      setCancelId(null);
    } catch (err: any) {
      setError(err.message);
      setCancelId(null);
    }
  };

  const filtered = filter === "ALL" ? requests : requests.filter((r) => r.status === filter);
  const statusCounts = {
    ALL: requests.length,
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    APPROVED: requests.filter((r) => r.status === "APPROVED").length,
    REJECTED: requests.filter((r) => r.status === "REJECTED").length,
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
      <h1 className="page-header mb-1">My Enrollment Requests</h1>
      <p className="text-sm text-muted-foreground mb-6">Track the status of your enrollment requests</p>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === s ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()} ({statusCounts[s]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="dash-card p-12 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No {filter === "ALL" ? "" : filter.toLowerCase()} requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((request) => (
            <div key={request.id} className="dash-card p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {request.course_image_url ? (
                    <img src={request.course_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">{request.course_title || `Course #${request.course_id}`}</p>
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>Requested: {formatDate(request.created_at)}</span>
                    {request.amount > 0 && <span>Amount: {formatPrice(request.amount)}</span>}
                  </div>
                  {request.admin_notes && (
                    <p className="text-xs text-muted-foreground mt-2 bg-muted rounded p-2">
                      <strong>Admin notes:</strong> {request.admin_notes}
                    </p>
                  )}
                </div>
                {request.status === "PENDING" && (
                  <button
                    onClick={() => setCancelId(request.id)}
                    className="text-xs text-red-500 hover:text-red-700 shrink-0 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4 text-yellow-600">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-foreground">Cancel Request</h2>
            </div>
            <p className="text-muted-foreground mb-4">Are you sure you want to cancel this enrollment request?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCancelId(null)} className="btn-outline-secondary">Keep Request</button>
              <button onClick={handleCancel} className="btn-destructive">Cancel Request</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
