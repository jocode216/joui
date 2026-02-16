import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Pencil, Trash2, Eye, Plus, Loader2, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Type definitions
interface Course {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price: number;
  slug: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  teacher_name?: string;
  teacher_id?: number;
  enrollment_count?: number;
  created_at: string;
  thumbnail_url?: string;
}

interface ApiResponse {
  success: boolean;
  data?: Course[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
  message?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const AdminCourses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [pagination.page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(
        `${API_BASE_URL}/courses?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch courses");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch courses");
      }

      setCourses(data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 1,
      }));
    } catch (error) {
      const err = error as Error;
      console.error("Error fetching courses:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_BASE_URL}/courses/${selectedCourse.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete course");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to delete course");
      }

      setIsDeleteDialogOpen(false);
      setSelectedCourse(null);
      fetchCourses();

      toast({
        title: "Success",
        description: data.message || "Course deleted successfully",
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error deleting course:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (courseId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(
        `${API_BASE_URL}/courses/${courseId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "APPROVED" }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to approve course");
      }

      toast({
        title: "Success",
        description: "Course approved successfully",
      });

      fetchCourses();
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (courseId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(
        `${API_BASE_URL}/courses/${courseId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "REJECTED" }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to reject course");
      }

      toast({
        title: "Success",
        description: "Course rejected",
      });

      fetchCourses();
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const filteredCourses = courses.filter((course) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(searchLower) ||
      (course.description &&
        course.description.toLowerCase().includes(searchLower)) ||
      (course.category &&
        course.category.toLowerCase().includes(searchLower)) ||
      (course.teacher_name &&
        course.teacher_name.toLowerCase().includes(searchLower));
    return matchesSearch;
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/placeholder-image.jpg";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">All Courses</h1>
            <p className="text-muted-foreground mt-1">
              Manage all courses on the platform ({pagination.total} courses)
            </p>
          </div>

          <Button
            className="btn-brand"
            onClick={() => navigate("/admin/courses/add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by title, description, teacher, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Courses Table */}
        <div className="card-minimal overflow-hidden border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="table-header">Course</TableHead>
                <TableHead className="table-header">Teacher</TableHead>
                <TableHead className="table-header">Category</TableHead>
                <TableHead className="table-header">Price</TableHead>
                <TableHead className="table-header">Enrollments</TableHead>
                <TableHead className="table-header">Status</TableHead>
                <TableHead className="table-header text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading courses...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchQuery
                      ? "No courses found matching your search"
                      : "No courses found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => {
                  return (
                    <TableRow key={course.id}>
                      <TableCell className="table-cell">
                        <div className="flex items-center gap-3">
                          {course.thumbnail_url ? (
                            <img
                              src={course.thumbnail_url}
                              alt={course.title}
                              className="h-10 w-10 rounded-md object-cover"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <span className="font-medium line-clamp-1">
                              {course.title}
                            </span>
                            {course.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                                {course.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell text-muted-foreground">
                        {course.teacher_name || "N/A"}
                      </TableCell>
                      <TableCell className="table-cell text-muted-foreground capitalize">
                        {course.category || "Uncategorized"}
                      </TableCell>
                      <TableCell className="table-cell font-medium">
                        ETB {course.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="table-cell">
                        {course.enrollment_count || 0}
                      </TableCell>
                      <TableCell className="table-cell">
                        <Badge
                          className={`
                            ${
                              course.status === "APPROVED"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : course.status === "PENDING"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="table-cell text-right">
                        <div className="flex items-center justify-end gap-2">
                          {course.status === "PENDING" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleApprove(course.id)}
                                title="Approve Course"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleReject(course.id)}
                                title="Reject Course"
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          <Link to={`/course/${course.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/admin/courses/${course.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(course)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent className="bg-background">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Course?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedCourse?.title}"? This
                action cannot be undone and will also delete all lessons and enrollments
                associated with this course.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCourse}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
