import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

// API base URL
const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:3000/api";

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
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

// Get current user from localStorage
const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
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

// Info Card component
const InfoCard = ({ title, children }) => (
  <div className="dash-card p-6">
    <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
    {children}
  </div>
);

// Info Row component
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-border last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value || "—"}</span>
  </div>
);

function UsersDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherRequest, setTeacherRequest] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [updating, setUpdating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user to check if viewing own profile
      const currentUser = getCurrentUser();
      const isOwnProfile = currentUser?.userId === parseInt(id);
      const isAdmin = currentUser?.role === "ADMIN";

      // Use appropriate endpoint based on permissions
      const endpoint = isAdmin ? `/admin/users/${id}` : `/users/${id}/profile`;
      
      // Fetch user details
      const userData = await apiCall(endpoint);
      setUser(userData.data || userData);

      // Fetch enrollments for students (using existing endpoints)
      if (userData.data?.role === "STUDENT" || isOwnProfile) {
        try {
          // For own profile, use /users/me/enrollments
          // For admin viewing others, we'd need a different endpoint
          const enrollmentsEndpoint = isOwnProfile 
            ? "/users/me/enrollments" 
            : (isAdmin ? `/admin/users/${id}/enrollments` : null);
          
          if (enrollmentsEndpoint) {
            const enrollmentsData = await apiCall(enrollmentsEndpoint);
            setEnrollments(enrollmentsData.data || []);
          }
        } catch (err) {
          console.warn("Could not fetch enrollments:", err);
        }
      }

      // If user is a teacher, fetch their courses
      if (userData.data?.role === "TEACHER") {
        try {
          const coursesData = await apiCall(`/courses?teacher_id=${id}`);
          setCourses(coursesData.data || []);
        } catch (err) {
          console.warn("Could not fetch courses:", err);
        }
      }

      // Fetch certificates for the user
      try {
        const certificatesEndpoint = isOwnProfile
          ? "/certificates/my-certificates"
          : (isAdmin ? `/certificates/user/${id}` : null);
        
        if (certificatesEndpoint) {
          const certificatesData = await apiCall(certificatesEndpoint);
          setCertificates(certificatesData.data ? [certificatesData.data] : []);
        }
      } catch (err) {
        console.warn("Could not fetch certificates:", err);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const currentUser = getCurrentUser();
      setIsOwnProfile(currentUser?.userId === parseInt(id));
      setIsAdmin(currentUser?.role === "ADMIN");
      fetchUserDetails();
    }
  }, [id]);

  const handleToggleStatus = async () => {
    try {
      setUpdating(true);
      await apiCall(`/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      // Refresh user data
      fetchUserDetails();
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePromoteToTeacher = async () => {
    try {
      setUpdating(true);
      await apiCall(`/admin/teacher-requests/${id}/approve`, {
        method: "POST",
      });
      // Refresh user data
      fetchUserDetails();
    } catch (err) {
      console.error("Error promoting user:", err);
      alert("Failed to promote user: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setUpdating(true);
      await apiCall(`/admin/users/${id}`, {
        method: "DELETE",
      });
      navigate("/admin/users");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchUserDetails} />;
  if (!user)
    return (
      <ErrorMessage
        message="User not found"
        onRetry={() => navigate("/admin/users")}
      />
    );

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  return (
    <DashboardLayout>
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(isAdmin ? "/admin/users" : "/dashboard")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to {isAdmin ? "Users" : "Dashboard"}
          </button>
          <h1 className="page-header mb-0">
            {isOwnProfile ? "My Profile" : "User Profile"}
          </h1>
        </div>
        {isAdmin && (
          <div className="flex gap-3">
            <Link
              to={`/admin/users/${id}/edit`}
              className="btn-primary text-sm px-4 py-2 no-underline"
            >
              Edit User
            </Link>
            {user.role !== "ADMIN" && (
              <button
                onClick={handleDeleteUser}
                disabled={updating}
                className="btn-destructive text-sm px-4 py-2"
              >
                Delete User
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Header Card */}
      <div className="dash-card p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {fullName || "No Name"}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <RoleBadge role={user.role} />
                <StatusBadge isActive={user.is_active} />
              </div>
              <p className="text-muted-foreground mt-2">{user.email}</p>
              {user.phone && (
                <p className="text-muted-foreground">{user.phone}</p>
              )}
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={handleToggleStatus}
                disabled={updating}
                className={`text-sm px-4 py-2 rounded-lg ${
                  user.is_active
                    ? "btn-outline-destructive"
                    : "btn-outline-primary"
                }`}
              >
                {user.is_active ? "Deactivate Account" : "Activate Account"}
              </button>
              {user.role === "STUDENT" && (
                <button
                  onClick={handlePromoteToTeacher}
                  disabled={updating}
                  className="btn-outline-primary text-sm px-4 py-2"
                >
                  Promote to Teacher
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "overview"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Overview
        </button>
        {(user.role === "STUDENT" || isOwnProfile) && (
          <button
            onClick={() => setActiveTab("enrollments")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "enrollments"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Enrollments ({enrollments.length})
          </button>
        )}
        {(isOwnProfile || isAdmin) && (
          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "certificates"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Certificates ({certificates.length})
          </button>
        )}
        {user.role === "TEACHER" && (
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "courses"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Courses ({courses.length})
          </button>
        )}
        {teacherRequest && (
          <button
            onClick={() => setActiveTab("teacher-request")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "teacher-request"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Teacher Request
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Overview (always visible) */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Personal Information */}
              <InfoCard title="Personal Information">
                <InfoRow label="First Name" value={user.first_name} />
                <InfoRow label="Last Name" value={user.last_name} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Phone" value={user.phone} />
                <InfoRow label="Role" value={user.role} />
                <InfoRow
                  label="Status"
                  value={user.is_active ? "Active" : "Inactive"}
                />
              </InfoCard>

              {/* Account Information */}
              <InfoCard title="Account Information">
                <InfoRow label="User ID" value={user.id} />
                <InfoRow
                  label="Created"
                  value={
                    user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "—"
                  }
                />
                <InfoRow
                  label="Last Updated"
                  value={
                    user.updated_at
                      ? new Date(user.updated_at).toLocaleString()
                      : "—"
                  }
                />
              </InfoCard>
            </>
          )}

          {activeTab === "enrollments" && (
            <InfoCard title="Course Enrollments">
              {enrollments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No enrollments found
                </p>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <h3 className="font-semibold text-foreground">
                        {enrollment.course_title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enrolled:{" "}
                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </p>
                      {enrollment.progress !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </InfoCard>
          )}

          {activeTab === "courses" && (
            <InfoCard title="Created Courses">
              {courses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No courses created
                </p>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {course.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {course.lessons_count || 0} lessons ·{" "}
                            {course.enrollments_count || 0} students
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.status === "APPROVED"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700"
                              : course.status === "PENDING"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700"
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </InfoCard>
          )}

          {activeTab === "teacher-request" && teacherRequest && (
            <InfoCard title="Teacher Request Details">
              <InfoRow label="Status" value={teacherRequest.status} />
              <InfoRow
                label="Submitted"
                value={new Date(teacherRequest.created_at).toLocaleString()}
              />
              {teacherRequest.reviewed_at && (
                <InfoRow
                  label="Reviewed"
                  value={new Date(teacherRequest.reviewed_at).toLocaleString()}
                />
              )}
              {teacherRequest.bio && (
                <div className="py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground block mb-1">
                    Bio
                  </span>
                  <p className="text-sm text-foreground">
                    {teacherRequest.bio}
                  </p>
                </div>
              )}
              {teacherRequest.qualifications && (
                <div className="py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground block mb-1">
                    Qualifications
                  </span>
                  <p className="text-sm text-foreground">
                    {teacherRequest.qualifications}
                  </p>
                </div>
              )}
              {teacherRequest.specialization && (
                <div className="py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground block mb-1">
                    Specialization
                  </span>
                  <p className="text-sm text-foreground">
                    {teacherRequest.specialization}
                  </p>
                </div>
              )}
              {teacherRequest.review_notes && (
                <div className="py-3">
                  <span className="text-sm text-muted-foreground block mb-1">
                    Review Notes
                  </span>
                  <p className="text-sm text-foreground">
                    {teacherRequest.review_notes}
                  </p>
                </div>
              )}
            </InfoCard>
          )}

          {activeTab === "certificates" && (
            <InfoCard title="Certificates">
              {certificates.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No certificates found
                </p>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        {cert.image_url && (
                          <img
                            src={cert.image_url}
                            alt="Certificate"
                            className="w-24 h-16 object-cover rounded border"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            Certificate ID: {cert.certificate_id}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Issued: {new Date(cert.issued_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Name: {cert.full_name}
                          </p>
                        </div>
                        <a
                          href={`/c/${cert.certificate_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </InfoCard>
          )}
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <InfoCard title="Quick Stats">
            <div className="space-y-4">
              {(user.role === "STUDENT" || isOwnProfile) && (
                <>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-3xl font-bold text-primary">
                      {enrollments.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enrolled Courses
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {enrollments.filter((e) => e.progress === 100).length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed Courses
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {certificates.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Certificates
                    </p>
                  </div>
                </>
              )}

              {user.role === "TEACHER" && (
                <>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-3xl font-bold text-primary">
                      {courses.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total Courses
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {courses.filter((c) => c.status === "APPROVED").length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Approved Courses
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      {courses.filter((c) => c.status === "PENDING").length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pending Approval
                    </p>
                  </div>
                </>
              )}
            </div>
          </InfoCard>

          {/* Quick Actions */}
          <InfoCard title="Quick Actions">
            <div className="space-y-3">
              {isAdmin && (
                <>
                  <Link
                    to={`/admin/users/${id}/edit`}
                    className="btn-primary w-full text-center no-underline"
                  >
                    Edit Profile
                  </Link>

                  {user.role === "STUDENT" && (
                    <button
                      onClick={handlePromoteToTeacher}
                      disabled={updating}
                      className="btn-outline-primary w-full"
                    >
                      Promote to Teacher
                    </button>
                  )}

                  <button
                    onClick={handleToggleStatus}
                    disabled={updating}
                    className={`w-full ${
                      user.is_active
                        ? "btn-outline-destructive"
                        : "btn-outline-primary"
                    }`}
                  >
                    {user.is_active ? "Deactivate Account" : "Activate Account"}
                  </button>

                  {user.role !== "ADMIN" && (
                    <button
                      onClick={handleDeleteUser}
                      disabled={updating}
                      className="btn-outline-destructive w-full"
                    >
                      Delete Account
                    </button>
                  )}
                </>
              )}
              
              {isOwnProfile && !isAdmin && (
                <Link
                  to="/dashboard"
                  className="btn-primary w-full text-center no-underline"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </InfoCard>

          {/* Activity Timeline (if available) */}
          {user.last_login && (
            <InfoCard title="Recent Activity">
              <InfoRow
                label="Last Login"
                value={new Date(user.last_login).toLocaleString()}
              />
            </InfoCard>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UsersDetail;
