import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiCall, formatDate } from "@/lib/api";
import { Check, X, RefreshCw, Users } from "lucide-react";

interface PendingTeacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

export default function AdminTeacherRequests() {
  const [teachers, setTeachers] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingTeachers();
  }, []);

  const fetchPendingTeachers = async () => {
    setLoading(true);
    setError("");
    try {
      // GET /users/pending/approvals returns all unapproved users
      const data = await apiCall("/users/pending/approvals");
      const all = data.data || data || [];
      // Filter to only TEACHER role pending users
      setTeachers(all.filter((u: PendingTeacher) => u.role === "TEACHER"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    setProcessing(userId);
    try {
      await apiCall(`/users/${userId}/approve`, { method: "PUT" });
      setTeachers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId: number) => {
    setProcessing(userId);
    try {
      await apiCall(`/users/${userId}`, { method: "DELETE" });
      setTeachers((prev) => prev.filter((u) => u.id !== userId));
      setRejectId(null);
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
          <h1 className="page-header mb-0">Teacher Approval Requests</h1>
          <p className="text-sm text-muted-foreground">{teachers.length} pending</p>
        </div>
        <button onClick={fetchPendingTeachers} className="btn-outline-secondary flex items-center gap-2">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {teachers.length === 0 ? (
        <div className="dash-card p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No pending teacher approval requests</p>
        </div>
      ) : (
        <div className="dash-card overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="font-medium text-foreground">
                    {teacher.first_name} {teacher.last_name}
                  </td>
                  <td className="text-muted-foreground">{teacher.email}</td>
                  <td className="text-muted-foreground">{teacher.phone || "—"}</td>
                  <td className="text-muted-foreground">{formatDate(teacher.created_at)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(teacher.id)}
                        disabled={processing === teacher.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button
                        onClick={() => setRejectId(teacher.id)}
                        disabled={processing === teacher.id}
                        className="btn-outline-destructive text-xs px-3 py-1.5"
                      >
                        <X className="w-3 h-3 inline mr-1" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Reject Teacher</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This will delete the teacher's account. Are you sure?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRejectId(null)} className="btn-outline-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectId)}
                disabled={processing === rejectId}
                className="btn-destructive disabled:opacity-50"
              >
                Reject & Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
