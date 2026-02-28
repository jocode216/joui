import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Check,
  Eye,
  EyeOff,
  BookOpen,
  Users,
  DollarSign,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react";

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

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "REJECTED":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "APPROVED":
        return <Check size={12} />;
      case "PENDING":
        return <Clock size={12} />;
      case "REJECTED":
        return <X size={12} />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusStyles()}`}
    >
      {getStatusIcon()} {status || "UNKNOWN"}
    </span>
  );
};

// Active badge component
const ActiveBadge = ({ isActive }) => {
  return isActive ? (
    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
      <Eye size={12} /> Visible
    </span>
  ) : (
    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
      <EyeOff size={12} /> Hidden
    </span>
  );
};

// Clock icon component for pending
const Clock = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Course Form Modal
const CourseModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
  categories,
  teachers,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    teacher_id: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || "",
        image_url: initialData.image_url || "",
        category_id: initialData.category_id || "",
        teacher_id: initialData.teacher_id || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        image_url: "",
        category_id: "",
        teacher_id: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    // Validate
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Course description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = "Price must be a valid number";
    }

    if (formData.image_url && !formData.image_url.match(/^https?:\/\/.+/)) {
      newErrors.image_url = "Image URL must be a valid URL";
    }

    if (!formData.teacher_id) {
      newErrors.teacher_id = "Please select a teacher";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        category_id: formData.category_id
          ? parseInt(formData.category_id)
          : null,
        teacher_id: parseInt(formData.teacher_id),
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-background rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {isEditing ? "Edit Course" : "Create New Course"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Course Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Complete Web Development Bootcamp"
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.title ? "border-destructive" : "border-input"
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Detailed description of the course..."
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.description ? "border-destructive" : "border-input"
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Teacher Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Teacher <span className="text-destructive">*</span>
              </label>
              <select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.teacher_id ? "border-destructive" : "border-input"
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name} - {teacher.email}
                  </option>
                ))}
              </select>
              {errors.teacher_id && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.teacher_id}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.price ? "border-destructive" : "border-input"
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-destructive">{errors.price}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Leave empty for free courses
              </p>
            </div>

            {/* Image URL Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.image_url ? "border-destructive" : "border-input"
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
              />
              {errors.image_url && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.image_url}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-xs text-destructive">{errors.submit}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-4 py-2"
            >
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Update Course"
                  : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Status Update Modal
const StatusModal = ({ isOpen, onClose, onUpdate, course }) => {
  const [status, setStatus] = useState(course?.status || "PENDING");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (course) {
      setStatus(course.status);
    }
  }, [course]);

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      await onUpdate({ status });
      onClose();
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Update Course Status
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Course: {course.title}
        </p>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
            <input
              type="radio"
              name="status"
              value="APPROVED"
              checked={status === "APPROVED"}
              onChange={(e) => setStatus(e.target.value)}
              className="text-primary"
            />
            <div>
              <p className="font-medium text-foreground">Approved</p>
              <p className="text-xs text-muted-foreground">
                Course will be visible to students
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
            <input
              type="radio"
              name="status"
              value="PENDING"
              checked={status === "PENDING"}
              onChange={(e) => setStatus(e.target.value)}
              className="text-primary"
            />
            <div>
              <p className="font-medium text-foreground">Pending</p>
              <p className="text-xs text-muted-foreground">
                Course waiting for review
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
            <input
              type="radio"
              name="status"
              value="REJECTED"
              checked={status === "REJECTED"}
              onChange={(e) => setStatus(e.target.value)}
              className="text-primary"
            />
            <div>
              <p className="font-medium text-foreground">Rejected</p>
              <p className="text-xs text-muted-foreground">
                Course not approved
              </p>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn-outline-secondary px-4 py-2">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={updating}
            className="btn-primary px-4 py-2"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  courseTitle,
  isHardDelete,
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {isHardDelete ? "Permanently Delete Course" : "Delete Course"}
        </h2>
        <p className="text-muted-foreground mb-4">
          {isHardDelete
            ? `Are you sure you want to permanently delete "${courseTitle}"? This action cannot be undone and will remove all lessons and associated data.`
            : `Are you sure you want to delete "${courseTitle}"? The course will be hidden but can be restored later.`}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline-secondary px-4 py-2">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className={
              isHardDelete
                ? "btn-destructive px-4 py-2"
                : "btn-outline-destructive px-4 py-2"
            }
          >
            {deleting
              ? "Deleting..."
              : isHardDelete
                ? "Permanently Delete"
                : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
function AdminCourse() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [teacherFilter, setTeacherFilter] = useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const limit = 10;

  // Stats
  const [stats, setStats] = useState({
    total_courses: 0,
    pending_courses: 0,
    approved_courses: 0,
    rejected_courses: 0,
    active_courses: 0,
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHardDeleteModal, setShowHardDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch courses with filters
      let url = `/courses?page=${currentPage}&limit=${limit}`;
      if (searchTerm) url += `&q=${encodeURIComponent(searchTerm)}`;
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;
      if (teacherFilter !== "ALL") url += `&teacher_id=${teacherFilter}`;

      const coursesData = await apiCall(url);
      setCourses(coursesData.data || []);
      setFilteredCourses(coursesData.data || []);
      setTotalPages(coursesData.pagination?.totalPages || 1);
      setTotalCourses(coursesData.pagination?.total || 0);

      // Fetch teachers (users with role TEACHER)
      const teachersData = await apiCall("/users/role/TEACHER?limit=100");
      setTeachers(teachersData.data || []);

      // Fetch stats
      const statsData = await apiCall("/courses/stats/overview");
      setStats(statsData.data?.summary || {});
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, statusFilter, teacherFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setTeacherFilter("ALL");
    setCurrentPage(1);
  };

  const handleCreateCourse = async (formData) => {
    await apiCall("/courses", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    await fetchData();
  };

  const handleUpdateCourse = async (formData) => {
    await apiCall(`/courses/${selectedCourse.id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
    await fetchData();
  };

  const handleUpdateStatus = async (data) => {
    await apiCall(`/courses/${selectedCourse.id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    await fetchData();
  };

  const handleToggleActive = async (course) => {
    await apiCall(`/courses/${course.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: !course.is_active }),
    });
    await fetchData();
  };

  const handleSoftDelete = async () => {
    await apiCall(`/courses/${selectedCourse.id}`, {
      method: "DELETE",
    });
    await fetchData();
  };

  const handleHardDelete = async () => {
    // There is no hard delete route in backend yet, using soft delete as fallback
    await apiCall(`/courses/${selectedCourse.id}`, {
      method: "DELETE",
    });
    await fetchData();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="page-header mb-1">Course Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all courses - {stats.approved_courses || 0} approved,{" "}
            {stats.pending_courses || 0} pending
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCourse(null);
            setShowCreateModal(true);
          }}
          className="btn-primary flex items-center gap-2 no-underline"
        >
          <Plus size={18} />
          New Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="dash-card p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-bold text-foreground">
            {stats.total_courses || 0}
          </p>
        </div>
        <div className="dash-card p-4">
          <p className="text-xs text-muted-foreground">Approved</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {stats.approved_courses || 0}
          </p>
        </div>
        <div className="dash-card p-4">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.pending_courses || 0}
          </p>
        </div>
        <div className="dash-card p-4">
          <p className="text-xs text-muted-foreground">Rejected</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            {stats.rejected_courses || 0}
          </p>
        </div>
        <div className="dash-card p-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {stats.active_courses || 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="dash-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses by title or description..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </form>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[120px]"
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[150px]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Teacher Filter */}
          <select
            value={teacherFilter}
            onChange={(e) => {
              setTeacherFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[150px]"
          >
            <option value="ALL">All Teachers</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name} {teacher.last_name}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="btn-outline-secondary px-4 py-2 flex items-center gap-2 text-sm"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="dash-card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Title</th>
              <th>Teacher</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Visibility</th>
              <th>Lessons</th>
              <th>Students</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-8 text-muted-foreground"
                >
                  No courses found
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td className="font-medium text-foreground max-w-xs">
                    <div className="truncate" title={course.title}>
                      {course.title}
                    </div>
                  </td>
                  <td className="text-muted-foreground">
                    {course.teacher_first_name} {course.teacher_last_name}
                  </td>
                  <td className="text-muted-foreground">
                    {course.category_name || "—"}
                  </td>
                  <td className="text-muted-foreground">
                    {course.price ? `$${course.price}` : "Free"}
                  </td>
                  <td>
                    <StatusBadge status={course.status} />
                  </td>
                  <td>
                    <ActiveBadge isActive={course.is_active} />
                  </td>
                  <td className="text-center">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {course.lessons_count || 0}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                      {course.enrollments_count || 0}
                    </span>
                  </td>
                  <td className="text-muted-foreground text-xs">
                    {course.created_at
                      ? new Date(course.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/courses/${course.id}`)}
                        className="btn-outline-primary text-xs px-2 py-1"
                        title="View Details"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowEditModal(true);
                        }}
                        className="btn-outline-secondary text-xs px-2 py-1"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowStatusModal(true);
                        }}
                        className="btn-outline-secondary text-xs px-2 py-1"
                        title="Update Status"
                      >
                        <Filter size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(course)}
                        className={`text-xs px-2 py-1 rounded-lg ${
                          course.is_active
                            ? "btn-outline-destructive"
                            : "btn-outline-primary"
                        }`}
                        title={course.is_active ? "Hide" : "Show"}
                      >
                        {course.is_active ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                      {!course.is_active && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowDeleteModal(true);
                            }}
                            className="btn-outline-destructive text-xs px-2 py-1"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowHardDeleteModal(true);
                            }}
                            className="btn-destructive text-xs px-2 py-1"
                            title="Permanently Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
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
            {Math.min(currentPage * limit, totalCourses)} of {totalCourses}{" "}
            courses
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CourseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCourse}
        isEditing={false}
        categories={categories}
        teachers={teachers}
      />

      <CourseModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCourse(null);
        }}
        onSubmit={handleUpdateCourse}
        initialData={selectedCourse}
        isEditing={true}
        categories={categories}
        teachers={teachers}
      />

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedCourse(null);
        }}
        onUpdate={handleUpdateStatus}
        course={selectedCourse}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleSoftDelete}
        courseTitle={selectedCourse?.title}
        isHardDelete={false}
      />

      <DeleteModal
        isOpen={showHardDeleteModal}
        onClose={() => {
          setShowHardDeleteModal(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleHardDelete}
        courseTitle={selectedCourse?.title}
        isHardDelete={true}
      />
    </DashboardLayout>
  );
}

export default AdminCourse;
