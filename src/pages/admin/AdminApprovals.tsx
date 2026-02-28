import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { apiCall, formatDate } from "@/lib/api";
import { Check, X, Users, BookOpen, RefreshCw } from "lucide-react";

type TabType = "users" | "courses";

interface PendingUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

interface PendingCourse {
  id: number;
  title: string;
  description: string;
  price: number;
  teacher_first_name: string;
  teacher_last_name: string;
  created_at: string;
  image_url: string;
}

export default function AdminApprovals() {
  const [tab, setTab] = useState<TabType>("users");
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pendingCourses, setPendingCourses] = useState<PendingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectType, setRejectType] = useState<"user" | "course">("user");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, coursesRes] = await Promise.allSettled([
        apiCall("/users/pending/approvals"),
        apiCall("/courses/pending/all"),
      ]);
      if (usersRes.status === "fulfilled") setPendingUsers(usersRes.value.data || usersRes.value || []);
      if (coursesRes.status === "fulfilled") setPendingCourses(coursesRes.value.data || coursesRes.value || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: number) => {
    setProcessing(userId);
    try {
      await apiCall(`/users/${userId}/approve`, { method: "PUT" });
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveCourse = async (courseId: number) => {
    setProcessing(courseId);
    try {
      await apiCall(`/courses/${courseId}/status`, { method: "PUT", body: JSON.stringify({ status: "APPROVED" }) });
      setPendingCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    setProcessing(rejectId);
    try {
      if (rejectType === "user") {
        // No dedicated reject endpoint — delete the user to reject
        await apiCall(`/users/${rejectId}`, { method: "DELETE" });
        setPendingUsers((prev) => prev.filter((u) => u.id !== rejectId));
      } else {
        await apiCall(`/courses/${rejectId}/status`, { method: "PUT", body: JSON.stringify({ status: "REJECTED", rejection_reason: rejectReason }) });
        setPendingCourses((prev) => prev.filter((c) => c.id !== rejectId));
      }
      setRejectId(null);
      setRejectReason("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-header mb-0">Pending Approvals</h1>
          <p className="text-sm text-muted-foreground">
            {pendingUsers.length} user{pendingUsers.length !== 1 ? "s" : ""} • {pendingCourses.length} course{pendingCourses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={fetchAll} className="btn-outline-secondary flex items-center gap-2">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${tab === "users" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Users className="w-4 h-4" /> Users ({pendingUsers.length})
        </button>
        <button
          onClick={() => setTab("courses")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${tab === "courses" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <BookOpen className="w-4 h-4" /> Courses ({pendingCourses.length})
        </button>
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        pendingUsers.length === 0 ? (
          <div className="dash-card p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No pending user approvals</p>
          </div>
        ) : (
          <div className="dash-card overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium text-foreground">{user.first_name} {user.last_name}</td>
                    <td className="text-muted-foreground">{user.email}</td>
                    <td className="text-muted-foreground">{user.phone || "—"}</td>
                    <td><StatusBadge status={user.role} /></td>
                    <td className="text-muted-foreground">{formatDate(user.created_at)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          disabled={processing === user.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => { setRejectId(user.id); setRejectType("user"); }}
                          disabled={processing === user.id}
                          className="btn-outline-destructive text-xs px-3 py-1.5"
                        >
                          <X className="w-3 h-3 inline" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Courses Tab */}
      {tab === "courses" && (
        pendingCourses.length === 0 ? (
          <div className="dash-card p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No pending course approvals</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingCourses.map((course) => (
              <div key={course.id} className="dash-card p-4 flex items-start gap-4">
                <div className="w-20 h-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {course.image_url ? (
                    <img src={course.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    by {course.teacher_first_name} {course.teacher_last_name} • {formatDate(course.created_at)}
                  </p>
                  {course.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApproveCourse(course.id)}
                    disabled={processing === course.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <Check className="w-3 h-3" /> Approve
                  </button>
                  <button
                    onClick={() => { setRejectId(course.id); setRejectType("course"); }}
                    disabled={processing === course.id}
                    className="btn-outline-destructive text-xs px-3 py-1.5"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Reject Reason Modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Reject {rejectType === "user" ? "User" : "Course"}</h2>
            <p className="text-sm text-muted-foreground mb-4">Provide a reason for rejection (optional)</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none mb-4"
              placeholder="Reason for rejection..."
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setRejectId(null); setRejectReason(""); }} className="btn-outline-secondary">Cancel</button>
              <button onClick={handleReject} className="btn-destructive">Reject</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
