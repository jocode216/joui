import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  CheckCircle,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Calendar,
  Loader2,
  Eye,
  DollarSign,
  Store,
  ShoppingBag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://storemy.josephteka.com/api";

interface OrderItem {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  unit_price: number | string;
  product_name: string;
  description?: string;
  image_url?: string;
  category?: string;
  brand?: string;
  store_name?: string;
  item_total?: number;
}

interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount?: number | string;
  order_total?: number | string;
  payment_method: string;
  payment_reference?: string;
  expires_at?: string;
  created_at: string;
  first_name: string;
  last_name: string;
  phone: string;
  address?: string;
  preferred_contact?: string;
  telegram_username?: string;
  email?: string;
  item_count: number;
  items: OrderItem[];
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  store_id?: number;
  store_name?: string;
}

interface StoreInfo {
  id: number;
  name: string;
  status: string;
  description?: string;
}

const StoreOrders = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStore, setLoadingStore] = useState(true);
  const [currentStore, setCurrentStore] = useState<StoreInfo | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  // Helper function to safely convert to number
  const toNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const num = typeof value === "string" ? parseFloat(value) : Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Fetch store owner's store first
  useEffect(() => {
    fetchStoreOwnerStore();
  }, []);

  const fetchStoreOwnerStore = async () => {
    try {
      setLoadingStore(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required. Please log in.",
          variant: "destructive",
        });
        return;
      }

      // Get user ID from localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User information not found");
      }
      // Fetch store owned by this user
      const response = await fetch(`${API_BASE_URL}/stores/owner/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const stores = data.data || [];

        if (stores.length === 0) {
          toast({
            title: "No Store Found",
            description: "You don't have a store yet. Please create one first.",
            variant: "destructive",
          });
          return;
        }

        // Get the first store (store owners typically have one store)
        const store = stores[0];
        setCurrentStore(store);

        // Now fetch store owner orders
        await fetchStoreOwnerOrders();
      } else {
        throw new Error(data.error || "Failed to fetch your store information");
      }
    } catch (error) {
      const err = error as Error;
      console.error("❌ Error fetching store:", err);
      toast({
        title: "Error",
        description: `Failed to load store information: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingStore(false);
    }
  };

  const fetchStoreOwnerOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        return;
      }
      // Fetch orders for the store owner
      const response = await fetch(`${API_BASE_URL}/orders/store-owner/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        
        // Try to parse the error
        let errorMessage = `Failed to fetch store owner orders: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
          console.error("📝 Parsed error data:", errorData);
        } catch (e) {
          console.error("📝 Raw error text:", errorText);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.success) {
        console.error("❌ API returned success: false", data);
        throw new Error(data.error || data.message || "Failed to fetch orders");
      }

      // Use the data from the response
      const ordersData: Order[] = data.data || [];
      // Already filtered by backend, but ensure only PAID and DELIVERED
      const paidOrders = ordersData.filter(
        (order) => order.status === "PAID" || order.status === "DELIVERED",
      );
      setOrders(paidOrders);
      
    } catch (error: any) {
      console.error("❌ Error fetching store owner orders:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load your store orders",
        variant: "destructive",
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      setLoadingOrderDetails(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Order details error response:", errorText);
        throw new Error(`Failed to fetch order details: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        // Filter items to show only those from current store
        const items = data.data.items || [];
        const storeItems = currentStore
          ? items.filter((item: any) => item.store_name === currentStore.name)
          : items;

        const orderWithItems = {
          id: data.data.id,
          user_id: data.data.user_id,
          status: data.data.status,
          total_amount: data.data.total_amount,
          order_total: data.data.order_total,
          payment_method: data.data.payment_method || "MANUAL",
          payment_reference: data.data.payment_reference,
          expires_at: data.data.expires_at,
          created_at: data.data.created_at,
          first_name: data.data.first_name || "",
          last_name: data.data.last_name || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
          email: data.data.email || "",
          preferred_contact: data.data.preferred_contact,
          telegram_username: data.data.telegram_username,
          item_count: storeItems.length,
          items: storeItems,
        };

        setSelectedOrder(orderWithItems);
      } else {
        throw new Error("Invalid order data received");
      }
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load order details",
        variant: "destructive",
      });
      // Fallback to basic order info
      const basicOrder = orders.find((o) => o.id === orderId);
      if (basicOrder) {
        setSelectedOrder(basicOrder);
      }
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update order status");
      }

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });

      // Refresh orders
      await fetchStoreOwnerOrders();
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getOrderTotal = (order: Order) => {
    // Calculate total from items
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      return order.items.reduce((total, item) => {
        const quantity = toNumber(item.quantity);
        const unitPrice = toNumber(item.unit_price);
        return total + quantity * unitPrice;
      }, 0);
    }

    // Fallback to existing totals
    if (order.total_amount !== undefined && order.total_amount !== null) {
      return toNumber(order.total_amount);
    }

    if (order.order_total !== undefined && order.order_total !== null) {
      return toNumber(order.order_total);
    }

    return 0;
  };

  const getOrderItemCount = (order: Order) => {
    // Count total items in order
    if (order.items && Array.isArray(order.items)) {
      return order.items.reduce((total, item) => {
        return total + toNumber(item.quantity);
      }, 0);
    }
    return 0;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone?.includes(searchQuery) ||
      order.payment_reference
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.items &&
        order.items.some((item) =>
          item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()),
        ));

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + getOrderTotal(order);
  }, 0);

  // Order Detail View
  if (selectedOrder) {
    const orderTotal = getOrderTotal(selectedOrder);
    const formattedDate = new Date(
      selectedOrder.created_at,
    ).toLocaleDateString();
    const expiresDate = selectedOrder.expires_at
      ? new Date(selectedOrder.expires_at).toLocaleDateString()
      : "N/A";

    // Filter items to only show those from current store
    const storeItems = currentStore
      ? selectedOrder.items.filter(
          (item) => item.store_name === currentStore.name,
        )
      : selectedOrder.items;

    return (
      <AdminLayout isStoreOwner>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOrder(null)}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>

            <div className="flex gap-2">
              {/* Mark as Delivered button - only show for PAID orders */}
              {selectedOrder.status === "PAID" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    updateOrderStatus(selectedOrder.id, "DELIVERED")
                  }
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Delivered
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    {selectedOrder.first_name} {selectedOrder.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Order ID: {selectedOrder.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: <StatusBadge status={selectedOrder.status} />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Items from your store: {storeItems.length}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrder.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="whitespace-pre-line">
                      {selectedOrder.address || "No address provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrder.email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="capitalize">
                      Contact:{" "}
                      {(
                        selectedOrder.preferred_contact || "whatsapp"
                      )?.toLowerCase()}
                    </span>
                  </div>
                  {selectedOrder.telegram_username && (
                    <div className="flex items-center gap-3 text-sm">
                      <span>Telegram: @{selectedOrder.telegram_username}</span>
                    </div>
                  )}
                </div>

                {/* Store Info */}
                {currentStore && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{currentStore.name}</p>
                        <p className="text-muted-foreground text-xs">
                          Store ID: {currentStore.id}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Order Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details - #{selectedOrder.id}
                  {currentStore && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      (Your store items only)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrderDetails ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading order details...
                  </div>
                ) : (
                  <>
                    {/* Store Info Banner */}
                    {currentStore && (
                      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Store className="h-4 w-4" />
                          <span className="font-medium">
                            {currentStore.name}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 rounded-full">
                            {currentStore.status}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Order Items List */}
                    <div className="space-y-4 mb-6">
                      <h3 className="font-semibold">
                        Items from Your Store ({storeItems.length})
                      </h3>
                      {storeItems.length > 0 ? (
                        storeItems.map((item, index) => {
                          const itemQuantity = toNumber(item.quantity);
                          const itemUnitPrice = toNumber(item.unit_price);
                          const itemTotal = itemQuantity * itemUnitPrice;

                          return (
                            <div
                              key={item.id || index}
                              className="flex items-start gap-4 pb-4 border-b last:border-0"
                            >
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.product_name}
                                  className="h-16 w-16 rounded-lg object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      "/placeholder-image.jpg";
                                  }}
                                />
                              ) : (
                                <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">
                                    No Image
                                  </span>
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold">
                                      {item.product_name || `Item ${index + 1}`}
                                    </h4>
                                    <p className="text-sm text-muted-foreground capitalize">
                                      Category:{" "}
                                      {item.category || "Uncategorized"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Quantity: {itemQuantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">
                                      ${itemTotal.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      ${itemUnitPrice.toFixed(2)} each
                                    </p>
                                  </div>
                                </div>
                                {item.description && (
                                  <p className="text-sm mt-2 text-muted-foreground">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No items from your store in this order
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                      <div>
                        <p className="text-muted-foreground">Your Items</p>
                        <p className="font-medium">{storeItems.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Quantity</p>
                        <p className="font-medium">
                          {storeItems.reduce(
                            (total, item) => total + toNumber(item.quantity),
                            0,
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Total from Your Store
                        </p>
                        <p className="font-medium">${orderTotal.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Order Date</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formattedDate}
                        </p>
                      </div>
                      {selectedOrder.payment_reference && (
                        <div className="col-span-2 md:col-span-3">
                          <p className="text-muted-foreground">
                            Payment Reference
                          </p>
                          <p className="font-mono font-medium text-sm">
                            {selectedOrder.payment_reference}
                          </p>
                        </div>
                      )}
                      {selectedOrder.payment_method && (
                        <div>
                          <p className="text-muted-foreground">
                            Payment Method
                          </p>
                          <p className="font-medium capitalize">
                            {selectedOrder.payment_method
                              .toLowerCase()
                              .replace(/_/g, " ")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <div className="flex gap-4">
                        {selectedOrder.status === "PAID" && (
                          <Button
                            className="btn-brand flex-1"
                            onClick={() =>
                              updateOrderStatus(selectedOrder.id, "DELIVERED")
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loadingStore) {
    return (
      <AdminLayout isStoreOwner>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">
              Loading store information...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!currentStore) {
    return (
      <AdminLayout isStoreOwner>
        <div className="text-center py-16">
          <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">No Store Found</h1>
          <p className="text-muted-foreground mb-6">
            You don't have a store yet. Please create one first to view orders.
          </p>
          <Button onClick={() => (window.location.href = "/store")}>
            Go to Store Dashboard
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout isStoreOwner>
      <div className="space-y-6">
        {/* Store Info Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Store Orders</h1>
            <p className="text-muted-foreground mt-1">
              Manage orders from your store:{" "}
              <span className="font-medium text-primary">
                {currentStore.name}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Store ID: {currentStore.id}
            </span>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid Orders</p>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "PAID").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "DELIVERED").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name, phone, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table - NO STORE COLUMN */}
        <div className="card-minimal overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="table-header">Customer</TableHead>
                <TableHead className="table-header">Items</TableHead>
                <TableHead className="table-header">Total Qty</TableHead>
                <TableHead className="table-header">Amount</TableHead>
                <TableHead className="table-header">Status</TableHead>
                <TableHead className="table-header">Date</TableHead>
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
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading orders...
                    </div>
                  </TableCell>
                </TableRow>
              ) : !Array.isArray(filteredOrders) ||
                filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {Array.isArray(orders) && orders.length === 0
                      ? "No orders from your store yet"
                      : "No orders match your filters"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const orderTotal = getOrderTotal(order);
                  const orderItemCount = getOrderItemCount(order);
                  const formattedDate = new Date(
                    order.created_at,
                  ).toLocaleDateString();

                  return (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-secondary/50"
                      onClick={() => fetchOrderDetails(order.id)}
                    >
                      <TableCell className="table-cell">
                        <div className="space-y-1">
                          <span className="font-medium">
                            {order.first_name} {order.last_name}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {order.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell">
                        <div className="space-y-1">
                          <span className="font-medium">
                            {order.items?.length || 0} item(s)
                          </span>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {order.items
                              ?.slice(0, 2)
                              .map((item) => item.product_name || "Item")
                              .join(", ")}
                            {order.items?.length > 2 &&
                              ` +${order.items.length - 2}`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell">
                        {orderItemCount}
                      </TableCell>
                      <TableCell className="table-cell font-medium">
                        ${orderTotal.toFixed(2)}
                      </TableCell>
                      <TableCell className="table-cell">
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="table-cell text-muted-foreground">
                        {formattedDate}
                      </TableCell>
                      <TableCell className="table-cell text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchOrderDetails(order.id);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {order.status === "PAID" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOrderStatus(order.id, "DELIVERED");
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Delivered
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Info Note */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Showing only paid and delivered orders from your store. Store owners
            can only view orders containing their products.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StoreOrders;