import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { dummyTeacherRequests, TeacherRequest } from "@/data/dummyData";

export default function AdminTeacherRequests() {
  const [requests, setRequests] = useState<TeacherRequest[]>(dummyTeacherRequests);

  const handleAction = (id: number, status: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <DashboardLayout>
      <h1 className="page-header">Teacher Requests</h1>

      <div className="dash-card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Requested</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td className="font-medium text-foreground">{req.userName}</td>
                <td className="text-muted-foreground">{req.userEmail}</td>
                <td className="text-muted-foreground">{req.requestedAt}</td>
                <td>
                  <span
                    className={
                      req.status === "pending"
                        ? "badge-pending"
                        : req.status === "approved"
                        ? "badge-approved"
                        : "badge-role"
                    }
                  >
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(req.id, "approved")}
                        className="btn-success text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "rejected")}
                        className="btn-danger text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
