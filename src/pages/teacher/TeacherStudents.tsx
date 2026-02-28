import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { apiCall, formatDate, formatPrice } from "@/lib/api";
import { Check, X, Eye, RefreshCw, BookOpen, Users } from "lucide-react";

interface TeacherEnrollmentRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  course_title: string;
  course_id: number;
  amount: number;
  status: string;
  payment_screenshot: string;
  transaction_id: string;
  notes: string;
  requested_at: string;
}

interface TeacherCourse {
  id: number;
  title: string;
}

export default function TeacherStudents() {
  const [requests, setRequests] = useState<TeacherEnrollmentRequest[]>([]);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [adminNotes, setAdminNotes] = useState("");
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [requestsRes, coursesRes] = await Promise.allSettled([
        apiCall("/teachers/enrollments/requests"),
        apiCall("/courses"), // returns teacher's own courses when authenticated as teacher
      ]);

      if (requestsRes.status === "fulfilled") {
        setRequests(requestsRes.value.data || requestsRes.value || []);
      }

      if (coursesRes.status === "fulfilled") {
        const allCourses = coursesRes.value.data || coursesRes.value || [];
        setCourses(allCourses);
      }
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

      setRequests((prev) => prev.filter((r) => r.id !== actionId));
      setActionId(null);
      setAdminNotes("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  // Apply filters
  const filtered = requests.filter((r) => {
    const courseMatch =
      selectedCourse === "ALL" ||
      String(r.course_id) === selectedCourse;
    const statusMatch = filter === "ALL" || r.status === filter;
    return courseMatch && statusMatch;
  });

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-header mb-0">My Students & Enrollment Requests</h1>
          <p className="text-sm text-muted-foreground">
            {requests.filter((r) => r.status === "PENDING").length} pending requests
          </p>
        </div>
        <button onClick={fetchData} className="btn-outline-secondary flex items-center gap-2">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="dash-card p-4 mb-6 flex flex-wrap gap-4">
        {/* Course selector */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-muted-foreground mb-1">Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
          <div className="flex gap-2 flex-wrap">
            {["PENDING", "APPROVED", "REJECTED", "ALL"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No enrollment requests found</p>
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
              {filtered.map((req) => (
                <tr key={req.id}>
                  <td>
                    <p className="font-medium text-foreground">
                      {req.first_name} {req.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{req.email}</p>
                  </td>
                  <td className="text-foreground">
                    {req.course_title || `Course #${req.course_id}`}
                  </td>
                  <td className="text-foreground font-medium">
                    {formatPrice(req.amount)}
                  </td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td>
                    {req.payment_screenshot ? (
                      <button
                        onClick={() => setViewImage(req.payment_screenshot)}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="text-muted-foreground">{formatDate(req.requested_at)}</td>
                  {filter === "PENDING" && (
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActionId(req.id);
                            setActionType("approve");
                          }}
                          disabled={processing === req.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => {
                            setActionId(req.id);
                            setActionType("reject");
                          }}
                          disabled={processing === req.id}
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

      {/* Action Confirmation Modal */}
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
                  : "Notes (optional)..."
              }
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
