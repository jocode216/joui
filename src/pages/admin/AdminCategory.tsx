import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Plus, Edit, Trash2, Search, X, Check, Eye, EyeOff } from 'lucide-react';

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
    throw new Error(data.error || `Request failed with status ${response.status}`);
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
const StatusBadge = ({ isActive }) => {
  return isActive ? (
    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
      <Check size={12} /> Active
    </span>
  ) : (
    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
      <EyeOff size={12} /> Inactive
    </span>
  );
};

// Category Form Modal
const CategoryModal = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({ name: '', description: '' });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    // Validate
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {isEditing ? 'Edit Category' : 'Create New Category'}
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
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Web Development"
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.name ? 'border-destructive' : 'border-input'
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Brief description of the category..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Optional: Provide a brief description of this category
              </p>
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
              {submitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, categoryName, isHardDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {isHardDelete ? 'Permanently Delete Category' : 'Delete Category'}
        </h2>
        <p className="text-muted-foreground mb-4">
          {isHardDelete 
            ? `Are you sure you want to permanently delete "${categoryName}"? This action cannot be undone and will remove all associated data.`
            : `Are you sure you want to deactivate "${categoryName}"? The category will be hidden but can be reactivated later.`
          }
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-outline-secondary px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className={isHardDelete ? 'btn-destructive px-4 py-2' : 'btn-outline-destructive px-4 py-2'}
          >
            {deleting ? 'Deleting...' : isHardDelete ? 'Permanently Delete' : 'Deactivate'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHardDeleteModal, setShowHardDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    total_categories: 0,
    active_categories: 0,
    most_popular_category: '',
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch categories (include inactive for admin)
      const data = await apiCall('/categories?include_inactive=true');
      setCategories(data.data || []);
      filterCategories(data.data || [], searchTerm, showInactive);
      
      // Fetch stats
      try {
        const statsData = await apiCall('/admin/categories/stats');
        setStats(statsData.data?.summary || {});
      } catch (statsErr) {
        console.warn('Could not fetch category stats:', statsErr);
      }
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search and active status
  const filterCategories = (cats, search, showInactive) => {
    let filtered = [...cats];
    
    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter(c => c.is_active);
    }
    
    // Filter by search term
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(term) || 
        (c.description && c.description.toLowerCase().includes(term))
      );
    }
    
    setFilteredCategories(filtered);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterCategories(categories, term, showInactive);
  };

  const toggleShowInactive = () => {
    const newShowInactive = !showInactive;
    setShowInactive(newShowInactive);
    filterCategories(categories, searchTerm, newShowInactive);
  };

  const handleCreateCategory = async (formData) => {
    await apiCall('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    await fetchCategories();
  };

  const handleUpdateCategory = async (formData) => {
    await apiCall(`/admin/categories/${selectedCategory.id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
    await fetchCategories();
  };

  const handleToggleStatus = async (category) => {
    try {
      await apiCall(`/admin/categories/${category.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: !category.is_active }),
      });
      await fetchCategories();
    } catch (err) {
      console.error('Error toggling category status:', err);
      alert('Failed to update category status: ' + err.message);
    }
  };

  const handleSoftDelete = async () => {
    await apiCall(`/admin/categories/${selectedCategory.id}`, {
      method: 'DELETE',
    });
    await fetchCategories();
  };

  const handleHardDelete = async () => {
    await apiCall(`/admin/categories/${selectedCategory.id}/hard`, {
      method: 'DELETE',
    });
    await fetchCategories();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="page-header mb-1">Category Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage course categories - {stats.active_categories} active, {stats.total_categories} total
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowCreateModal(true);
          }}
          className="btn-primary flex items-center gap-2 no-underline"
        >
          <Plus size={18} />
          New Category
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="dash-card p-4">
          <p className="text-sm text-muted-foreground">Total Categories</p>
          <p className="text-2xl font-bold text-foreground">{stats.total_categories || 0}</p>
        </div>
        <div className="dash-card p-4">
          <p className="text-sm text-muted-foreground">Active Categories</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.active_categories || 0}
          </p>
        </div>
        <div className="dash-card p-4">
          <p className="text-sm text-muted-foreground">Most Popular</p>
          <p className="text-lg font-semibold text-foreground truncate">
            {stats.most_popular_category || 'N/A'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="dash-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search categories by name or description..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Show Inactive Toggle */}
          <button
            onClick={toggleShowInactive}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showInactive
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {showInactive ? <Eye size={16} /> : <EyeOff size={16} />}
            {showInactive ? 'Showing All' : 'Active Only'}
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="dash-card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-muted-foreground">
                  No categories found
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="font-medium text-foreground">
                    {category.name}
                  </td>
                  <td className="text-muted-foreground font-mono text-xs">
                    {category.slug}
                  </td>
                  <td className="text-muted-foreground max-w-xs truncate">
                    {category.description || '—'}
                  </td>
                  <td>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {category.course_count || 0}
                    </span>
                  </td>
                  <td>
                    <StatusBadge isActive={category.is_active} />
                  </td>
                  <td className="text-muted-foreground">
                    {category.created_at ? new Date(category.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowEditModal(true);
                        }}
                        className="btn-outline-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                        title="Edit"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus(category)}
                        className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                          category.is_active
                            ? 'btn-outline-destructive'
                            : 'btn-outline-primary'
                        }`}
                        title={category.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {category.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                        {category.is_active ? 'Deactivate' : 'Activate'}
                      </button>

                      {!category.is_active && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowDeleteModal(true);
                            }}
                            className="btn-outline-destructive text-xs px-3 py-1.5"
                            title="Soft Delete"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowHardDeleteModal(true);
                            }}
                            className="btn-destructive text-xs px-3 py-1.5"
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

      {/* Modals */}
      <CategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCategory}
        isEditing={false}
      />

      <CategoryModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleUpdateCategory}
        initialData={selectedCategory}
        isEditing={true}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleSoftDelete}
        categoryName={selectedCategory?.name}
        isHardDelete={false}
      />

      <DeleteModal
        isOpen={showHardDeleteModal}
        onClose={() => {
          setShowHardDeleteModal(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleHardDelete}
        categoryName={selectedCategory?.name}
        isHardDelete={true}
      />
    </DashboardLayout>
  );
}

export default AdminCategory;