import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

// API base URL
const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:3000/api";

// Helper function for API calls
const apiCall = async (endpoint: string, options: any = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = { error: "Invalid response from server" };
  }

  if (!response.ok) {
    throw new Error(
      data.error || `Request failed with status ${response.status}`,
    );
  }

  return data;
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="dash-card p-8 text-center">
    <p className="text-destructive mb-4">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary">
        Try Again
      </button>
    )}
  </div>
);

// Role badge component
const RoleBadge = ({ role }) => {
  const getRoleStyles = () => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      case "TEACHER":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "STUDENT":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleStyles()}`}
    >
      {role || "Unknown"}
    </span>
  );
};

// Status badge component
const StatusBadge = ({ isActive }) => {
  return isActive ? (
    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
      Active
    </span>
  ) : (
    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
      Inactive
    </span>
  );
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const limit = 10;

  const fetchUsers = async (
    page = currentPage,
    search = searchTerm,
    role = roleFilter,
  ) => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = `/users?page=${page}&limit=${limit}`;

      // Add search if provided
      if (search && search.trim() !== "") {
        endpoint = `/users/search/all?q=${encodeURIComponent(search)}&page=${page}&limit=${limit}`;
      }
      // Add role filter if not ALL
      else if (role !== "ALL") {
        endpoint = `/users/role/${role}?page=${page}&limit=${limit}`;
      }

      const data = await apiCall(endpoint);

      setUsers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalUsers(data.pagination?.total || 0);
      setCurrentPage(data.pagination?.page || page);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchTerm, roleFilter);
  };

  const handleRoleFilterChange = (newRole) => {
    setRoleFilter(newRole);
    setCurrentPage(1);
    fetchUsers(1, searchTerm, newRole);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchUsers(newPage, searchTerm, roleFilter);
    }
  };

  const handleApproveUser = async (user) => {
    try {
      setUpdating(true);
      await apiCall(`/users/${user.id}/approve`, {
        method: "PUT",
      });
      // Refresh users list
      fetchUsers(currentPage, searchTerm, roleFilter);
    } catch (err) {
      console.error("Error approving user:", err);
      alert("Failed to approve user: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setUpdating(true);
      await apiCall(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ is_approved: !currentStatus }),
      });
      // Refresh users list
      fetchUsers(currentPage, searchTerm, roleFilter);
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);
      await apiCall(`/users/${selectedUser.id}`, {
        method: "DELETE",
      });
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      // Refresh users list
      fetchUsers(currentPage, searchTerm, roleFilter);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setUpdating(true);
      const formData = new FormData(e.target);
      const updates = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        role: formData.get("role"),
      };

      await apiCall(`/users/${selectedUser.id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      setShowEditModal(false);
      setSelectedUser(null);
      // Refresh users list
      fetchUsers(currentPage, searchTerm, roleFilter);
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading && users.length === 0) return <LoadingSpinner />;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-header mb-0">User Management</h1>
        <Link
          to="/admin/users/create"
          className="btn-primary text-sm px-4 py-2 no-underline"
        >
          + Add New User
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="dash-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" className="btn-primary px-4 py-2">
                Search
              </button>
            </div>
          </form>

          {/* Role Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => handleRoleFilterChange("ALL")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "ALL"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleRoleFilterChange("STUDENT")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "STUDENT"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Students
            </button>
            <button
              onClick={() => handleRoleFilterChange("TEACHER")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "TEACHER"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Teachers
            </button>
            <button
              onClick={() => handleRoleFilterChange("ADMIN")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === "ADMIN"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Admins
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="dash-card p-4 mb-6 bg-destructive/10 border-destructive/20">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="dash-card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Approved Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium text-foreground">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="text-muted-foreground">{user.email}</td>
                  <td className="text-muted-foreground">{user.phone || "—"}</td>
                  <td>
                    <RoleBadge role={user.role} />
                  </td>
                  <td>
                    <StatusBadge isActive={user.is_approved} />
                  </td>
                  <td className="text-muted-foreground">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        className="btn-outline-primary text-xs px-3 py-1.5"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className="btn-outline-secondary text-xs px-3 py-1.5"
                      >
                        Edit
                      </button>
                      {user.role !== "ADMIN" && !user.is_approved && (
                        <button
                          onClick={() => handleApproveUser(user)}
                          disabled={updating}
                          className="btn-outline-primary text-xs px-3 py-1.5"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleToggleUserStatus(user.id, user.is_approved)
                        }
                        disabled={updating}
                        className={`text-xs px-3 py-1.5 rounded-lg ${
                          user.is_approved
                            ? "btn-outline-destructive"
                            : "btn-outline-primary"
                        }`}
                      >
                        {user.is_approved ? "Revoke Approval" : "Grant Approval"}
                      </button>
                      {user.role !== "ADMIN" && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteConfirm(true);
                          }}
                          disabled={updating}
                          className="btn-outline-destructive text-xs px-3 py-1.5"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Edit User
            </h2>
            <form onSubmit={handleEditUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    defaultValue={selectedUser.first_name}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    defaultValue={selectedUser.last_name}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedUser.email}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={selectedUser.phone || ""}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    defaultValue={selectedUser.role}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-outline-secondary px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary px-4 py-2"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Confirm Delete
            </h2>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete {selectedUser.first_name}{" "}
              {selectedUser.last_name}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedUser(null);
                }}
                className="btn-outline-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={updating}
                className="btn-destructive px-4 py-2"
              >
                {updating ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
