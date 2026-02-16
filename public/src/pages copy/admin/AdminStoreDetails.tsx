import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Store,
  Package,
  ShoppingCart,
  User,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Mail,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

const AdminStoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      // ADD THIS DEBUGGING
      const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Also check response
      const data = await response.json();
      if (response.ok && data.success) {
        setStore(data.data);
      } else {
        throw new Error(data.error || "Failed to load store details");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStore = async () => {
    try {
      setActionLoading("approve");
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/admin/stores/${id}/status`,
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

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        fetchStoreData();
      } else {
        throw new Error(data.error || "Failed to approve store");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading("");
    }
  };

  const handleRejectStore = async () => {
    try {
      setActionLoading("reject");
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/admin/stores/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "REJECTED",
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        setShowRejectDialog(false);
        fetchStoreData();
      } else {
        throw new Error(data.error || "Failed to reject store");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading("");
    }
  };

  const handleSuspendStore = async () => {
    try {
      setActionLoading("suspend");
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/admin/stores/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "SUSPENDED",
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        setShowSuspendDialog(false);
        fetchStoreData();
      } else {
        throw new Error(data.error || "Failed to suspend store");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading("");
    }
  };

  const handleDeleteStore = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${store?.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setActionLoading("delete");
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        navigate("/admin/stores");
      } else {
        throw new Error(data.error || "Failed to delete store");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading("");
    }
  };

  useEffect(() => {
    if (id) {
      fetchStoreData();
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading store details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!store) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/stores")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stores
          </Button>
          <Card>
            <CardContent className="py-12 text-center">
              <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Store Not Found</h3>
              <p className="text-muted-foreground">
                The store you're looking for doesn't exist or has been removed.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadge = () => {
    const config = {
      PENDING: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: <Clock className="h-4 w-4" />,
        label: "Pending Approval",
      },
      APPROVED: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="h-4 w-4" />,
        label: "Approved",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="h-4 w-4" />,
        label: "Rejected",
      },
      SUSPENDED: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: <AlertCircle className="h-4 w-4" />,
        label: "Suspended",
      },
    }[store.status];

    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-2 px-3 py-1 ${config?.color}`}
      >
        {config?.icon}
        {config?.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/stores")}
              className="mt-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{store.name}</h1>
                {getStatusBadge()}
              </div>
              <p className="text-muted-foreground mt-1">
                Store ID: {store.id} • Created {formatDate(store.created_at)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {store.status === "PENDING" && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleApproveStore}
                  disabled={actionLoading === "approve"}
                >
                  {actionLoading === "approve" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve Store
                </Button>
                <Dialog
                  open={showRejectDialog}
                  onOpenChange={setShowRejectDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Store</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to reject "{store.name}"?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowRejectDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleRejectStore}
                        disabled={actionLoading === "reject"}
                      >
                        {actionLoading === "reject" ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent mr-2" />
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Store
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {store.status === "APPROVED" && (
              <Dialog
                open={showSuspendDialog}
                onOpenChange={setShowSuspendDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Suspend Store
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Suspend Store</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to suspend "{store.name}"? This will
                      make all its products unavailable.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowSuspendDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleSuspendStore}
                      disabled={actionLoading === "suspend"}
                    >
                      {actionLoading === "suspend" ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent mr-2" />
                          Suspending...
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Suspend Store
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {(store.status === "REJECTED" || store.status === "SUSPENDED") && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleApproveStore}
                disabled={actionLoading === "approve"}
              >
                {actionLoading === "approve" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Activate Store
              </Button>
            )}

            <Button
              variant="destructive"
              onClick={handleDeleteStore}
              disabled={actionLoading === "delete"}
            >
              {actionLoading === "delete" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </div>
        </div>

        {/* Store Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Store Owner</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <p className="font-medium">
                    {store.owner_first_name} {store.owner_last_name}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <p className="font-medium">{store.owner_phone}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Products</p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <p className="font-medium">
                    {store.statistics?.total_products || 0}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Products</p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <p className="font-medium">
                    {store.statistics?.active_products || 0}
                  </p>
                </div>
              </div>
            </div>

            {store.description && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-muted-foreground">{store.description}</p>
              </div>
            )}

            {/* Remove this section since we're not storing rejection reasons anymore */}
            {/* {store.rejection_reason && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 mb-1">
                  <XCircle className="h-4 w-4" />
                  <p className="font-medium">Rejection Reason</p>
                </div>
                <p className="text-red-700">{store.rejection_reason}</p>
              </div>
            )} */}
          </CardContent>
        </Card>

        {/* Recent Products */}
        {store.recent_products && store.recent_products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Latest products from this store</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {store.recent_products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        {product.total_quantity - product.reserved_quantity}{" "}
                        available
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.is_active ? "default" : "secondary"}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStoreDetail;