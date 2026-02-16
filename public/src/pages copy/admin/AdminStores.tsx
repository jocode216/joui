import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Package,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Store,
  User,
  Trash2,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/api";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

interface StoreData {
  id: number;
  name: string;
  description?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  created_at: string;
  owner_id: number;
  product_count?: number;
  owner_first_name?: string;
  owner_last_name?: string;
  owner_phone?: string;
  approved_at?: string;
  rejection_reason?: string;
}

const AdminStores = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      let url = `${API_BASE_URL}/stores`;
      if (statusFilter !== "all") {
        url = `${API_BASE_URL}/stores/status/${statusFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStores(data.data || []);
      } else {
        throw new Error(data.error || "Failed to fetch stores");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch stores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const { openConfirm } = useConfirmDialog();

  const handleDeleteStore = (storeId: number, storeName: string) => {
    openConfirm({
      title: "Delete Store",
      description: `Are you sure you want to delete "${storeName}"? This action cannot be undone.`,
      variant: "destructive",
      confirmText: "Yes, Delete Store",
      onConfirm: async () => {
        try {
          const token = getAuthToken();
          const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok && data.success) {
            toast({
              title: "Success",
              description: "Store deleted successfully",
            });
            fetchStores();
          } else {
            throw new Error(data.error || "Failed to delete store");
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to delete store",
            variant: "destructive",
          });
        }
      }
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchStores();
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/stores/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStores(data.data || []);
      } else {
        throw new Error(data.error || "Failed to search stores");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to search stores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [statusFilter]);

  const getStatusBadge = (status: string) => {
    const config = {
      PENDING: {
        color: "bg-amber-100 text-amber-800",
        icon: <Clock className="h-3 w-3" />,
      },
      APPROVED: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      REJECTED: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="h-3 w-3" />,
      },
      SUSPENDED: {
        color: "bg-orange-100 text-orange-800",
        icon: <AlertCircle className="h-3 w-3" />,
      },
    }[status];

    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-1 text-xs ${config?.color}`}
      >
        {config?.icon}
        {status.toLowerCase()}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Store Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all stores
            </p>
          </div>
          <Link to="/admin/stores/create">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Store
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stores by name, owner, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="sm:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    fetchStores();
                  }}
                  className="sm:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stores Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stores List</CardTitle>
            <CardDescription>
              {stores.length} stores found
              {statusFilter !== "all" &&
                ` • Filtered by: ${statusFilter.toLowerCase()}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                          <span className="ml-2">Loading stores...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : stores.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <Store className="h-8 w-8 mx-auto mb-2" />
                        No stores found
                      </TableCell>
                    </TableRow>
                  ) : (
                    stores.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">
                          <div>{store.name}</div>
                          {store.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {store.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div>
                                {store.owner_first_name} {store.owner_last_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {store.owner_phone}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>{store.product_count || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(store.status)}</TableCell>
                        <TableCell>
                          {new Date(store.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/stores/${store.id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                handleDeleteStore(store.id, store.name)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminStores;
