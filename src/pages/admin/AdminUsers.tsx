import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { dummyUsers } from "@/data/dummyData";

export default function AdminUsers() {
  const [users, setUsers] = useState(dummyUsers);

  const handlePromote = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "teacher" as const } : u))
    );
  };

  return (
    <DashboardLayout>
      <h1 className="page-header">User Management</h1>

      <div className="dash-card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-medium text-foreground">{user.name}</td>
                <td className="text-muted-foreground">{user.email}</td>
                <td>
                  <span className="badge-role capitalize">{user.role}</span>
                </td>
                <td>
                  <div className="flex gap-2">
                    {user.role === "user" && (
                      <button
                        onClick={() => handlePromote(user.id)}
                        className="btn-success text-xs"
                      >
                        Promote to Teacher
                      </button>
                    )}
                    <button className="btn-outline-primary text-xs px-3 py-1.5">
                      View Profile
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
