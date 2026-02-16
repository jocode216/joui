import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  PlusCircle,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Store,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";

// Type definitions - Updated to match backend
interface Store {
  id: number;
  name: string;
  description?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  owner_id: number;
  owner_first_name: string;
  owner_last_name: string;
  product_count: number;
  total_orders: number;
  created_at: string;
  approved_at?: string;
  approved_by?: number;
  rejection_reason?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  data?: Store[];
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

const GetStores: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchStores();
  }, [pagination.page]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let url = `${API_BASE_URL}/stores?page=${pagination.page}&limit=${pagination.limit}`;

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stores");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch stores");
      }

      setStores(data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 1,
      }));
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to load stores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchStores();
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const response = await fetch(
        `${API_BASE_URL}/stores/search?q=${encodeURIComponent(searchQuery)}&page=1&limit=${pagination.limit}`,
        { headers },
      );
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      if (!data.success) {
        throw new Error(data.error || "Search failed");
      }

      setStores(data.data || []);
      setPagination((prev) => ({
        ...prev,
        page: 1,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 1,
      }));
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Search failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storeId: number, storeName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${storeName}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete store");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to delete store");
      }

      toast({
        title: "Success",
        description: data.message || "Store deleted successfully",
      });

      // Refresh stores list
      fetchStores();
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to delete store",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Stores Management</h1>
              <p className="text-muted-foreground mt-2">
                View and manage all stores in the system
              </p>
            </div>
            <Button
              onClick={() => navigate("/stores/create")}
              className="btn-brand"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Store
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search stores by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </form>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  fetchStores();
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stores Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stores List</CardTitle>
            <CardDescription>
              Showing {stores.length} of {pagination.total} stores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : stores.length === 0 ? (
              <div className="text-center py-12">
                <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No stores found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery
                    ? "Try a different search term"
                    : "Get started by creating your first store"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => navigate("/stores/create")}
                    className="mt-4 btn-brand"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Store
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell className="font-medium">
                            <Link
                              to={`/stores/${store.id}`}
                              className="hover:text-primary hover:underline"
                            >
                              {store.name}
                            </Link>
                            {store.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {store.description.length > 50
                                  ? `${store.description.substring(0, 50)}...`
                                  : store.description}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            {store.owner_first_name} {store.owner_last_name}
                          </TableCell>
                          <TableCell>{getStatusBadge(store.status)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {store.product_count || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {store.total_orders || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(store.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/stores/${store.id}`)
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/stores/edit/${store.id}`)
                                  }
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDelete(store.id, store.name)
                                  }
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages} • Total{" "}
                      {pagination.total} stores
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GetStores;
