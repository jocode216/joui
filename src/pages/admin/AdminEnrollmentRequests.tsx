import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { apiCall, formatDate, formatPrice } from "@/lib/api";
import { Check, X, Eye, RefreshCw, Search, BookOpen } from "lucide-react";

interface EnrollmentRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  course_title: string;
  course_id: number;
  amount: number;
  status: string;
  payment_screenshot: string;
  transaction_id: string;
  notes: string;
  admin_notes: string;
  requested_at: string;
  teacher_first_name: string;
  teacher_last_name: string;
}

export default function AdminEnrollmentRequests() {
  const [enrollments, setEnrollments] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, [filter]);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError("");
    try {
      let url = "/enrollments/requests";
      if (filter !== "ALL") url += `?status=${filter}`;
      const data = await apiCall(url);
      setEnrollments(data.data || data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionId) return;
    setProcessing(actionId);
    try {
      const endpoint =
        actionType === "approve"
          ? `/enrollments/requests/${actionId}/approve`
          : `/enrollments/requests/${actionId}/reject`;

      const body: any = {
        status: actionType === "approve" ? "APPROVED" : "REJECTED",
      };
      if (adminNotes) body.admin_notes = adminNotes;

      await apiCall(endpoint, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      setEnrollments((prev) => prev.filter((e) => e.id !== actionId));
      setActionId(null);
      setAdminNotes("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const filtered = search
    ? enrollments.filter((e) =>
        `${e.first_name} ${e.last_name} ${e.course_title} ${e.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : enrollments;

  if (loading)
    return (
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
          <h1 className="page-header mb-0">Enrollment Requests</h1>
          <p className="text-sm text-muted-foreground">
            {enrollments.length} request{enrollments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={fetchEnrollments}
          className="btn-outline-secondary flex items-center gap-2"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="dash-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student or course..."
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["PENDING", "APPROVED", "REJECTED", "ALL"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === s
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="dash-card p-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No {filter === "ALL" ? "" : filter.toLowerCase()} enrollment requests
          </p>
        </div>
      ) : (
        <div className="dash-card overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Requested</th>
                {filter === "PENDING" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td>
                    <p className="font-medium text-foreground">
                      {enrollment.first_name} {enrollment.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{enrollment.email}</p>
                  </td>
                  <td className="text-foreground">
                    {enrollment.course_title || `Course #${enrollment.course_id}`}
                  </td>
                  <td className="text-foreground font-medium">
                    {formatPrice(enrollment.amount)}
                  </td>
                  <td>
                    <StatusBadge status={enrollment.status} />
                  </td>
                  <td>
                    {enrollment.payment_screenshot ? (
                      <button
                        onClick={() => setViewImage(enrollment.payment_screenshot)}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="text-muted-foreground">
                    {formatDate(enrollment.requested_at)}
                  </td>
                  {filter === "PENDING" && (
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActionId(enrollment.id);
                            setActionType("approve");
                          }}
                          disabled={processing === enrollment.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => {
                            setActionId(enrollment.id);
                            setActionType("reject");
                          }}
                          disabled={processing === enrollment.id}
                          className="btn-outline-destructive text-xs px-3 py-1.5"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Screenshot Viewer */}
      {viewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setViewImage(null)}
        >
          <div className="max-w-2xl max-h-[80vh] overflow-auto bg-background rounded-xl p-2">
            <img src={viewImage} alt="Payment proof" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}

      {/* Approve/Reject Modal */}
      {actionId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {actionType === "approve" ? "Approve" : "Reject"} Enrollment
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {actionType === "reject"
                ? "Please provide a reason for rejection."
                : "Add a note (optional)."}
            </p>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none mb-4"
              placeholder={
                actionType === "reject"
                  ? "Reason for rejection..."
                  : "Admin notes (optional)..."
              }
              required={actionType === "reject"}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setActionId(null);
                  setAdminNotes("");
                }}
                className="btn-outline-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={
                  processing === actionId ||
                  (actionType === "reject" && !adminNotes.trim())
                }
                className={
                  actionType === "approve"
                    ? "inline-flex items-center gap-1 px-4 py-2 text-sm rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 font-medium"
                    : "btn-destructive disabled:opacity-50"
                }
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}