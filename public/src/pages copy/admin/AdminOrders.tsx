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
  Trash2,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://storemy.josephteka.com/api";

interface OrderItem {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  unit_price: number | string; // Can be string from backend
  product_name: string;
  description?: string;
  image_url?: string;
  category?: string;
  brand?: string;
  store_name: string;
}

interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount?: number | string; // Can be string from backend
  order_total?: number | string; // Can be string from backend
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
  item_count: number;
  items: OrderItem[];
  // For backward compatibility in table view
  product_name?: string;
  quantity?: number;
  unit_price?: number | string;
  image_url?: string;
  category?: string;
  store?: string;
}

const AdminOrders = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<string[]>([]);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  // Helper function to safely convert to number
  const toNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const num = typeof value === "string" ? parseFloat(value) : Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Check if order can be cancelled
  const canCancelOrder = (order: Order): boolean => {
    const cancellableStatuses = ["AWAITING_PAYMENT", "PAID", "PROCESSING"];
    const nonCancellableStatuses = [
      "DELIVERED",
      "EXPIRED",
      "CANCELLED",
      "REFUNDED",
      "SHIPPED",
    ];

    return (
      cancellableStatuses.includes(order.status) &&
      !nonCancellableStatuses.includes(order.status)
    );
  };

  // Check if order can be marked as paid
  const canMarkAsPaid = (order: Order): boolean => {
    return order.status === "AWAITING_PAYMENT";
  };

  // Check if order can be deleted
  const canDeleteOrder = (order: Order): boolean => {
    // Allow deletion of cancelled or expired orders
    const deletableStatuses = ["CANCELLED", "EXPIRED"];
    return deletableStatuses.includes(order.status);
  };

  // Fetch orders and stores on component mount
  useEffect(() => {
    fetchOrders();
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/stores?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Handle different response formats
        if (Array.isArray(data)) {
          setStores(data.map((store: any) => store.name));
        } else if (data && data.data) {
          setStores(data.data.map((store: any) => store.name));
        } else if (data && data.stores) {
          setStores(data.stores.map((store: any) => store.name));
        }
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const fetchOrders = async () => {
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

      // Debug: Check token role
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        console.error("Failed to decode token:", e);
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Orders error response:", errorText);
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats
      let ordersData: Order[] = [];

      if (Array.isArray(data)) {
        ordersData = data;
      } else if (data && data.success && Array.isArray(data.data)) {
        ordersData = data.data;
      } else if (data && data.data && Array.isArray(data.data)) {
        ordersData = data.data;
      } else if (data && Array.isArray(data)) {
        ordersData = data;
      } else {
        console.warn("Unexpected orders response format:", data);
        ordersData = [];
        toast({
          title: "Warning",
          description: "Unexpected data format received from server",
          variant: "default",
        });
      }

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load orders",
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
        // Check if items array exists
        const items = data.data.items || [];

        // Make sure we have all the required fields
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
          preferred_contact: data.data.preferred_contact,
          telegram_username: data.data.telegram_username,
          item_count: items.length,
          items: items,
          // For backward compatibility
          product_name: items[0]?.product_name || "Multiple Items",
          quantity: items[0]?.quantity || 0,
          unit_price: items[0]?.unit_price || 0,
          image_url: items[0]?.image_url || "",
          category: items[0]?.category || "",
          store: items[0]?.store_name || "",
        };
        setSelectedOrder(orderWithItems);
      } else {
        console.error("Invalid order data structure:", data);
        throw new Error("Invalid order data received");
      }
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load order details",
        variant: "destructive",
      });
      // If we can't fetch details, try to use basic order info
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

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

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

      // Refresh orders to get updated data
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const cancelOrder = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel order");
      }

      // Update local state
      setOrders(orders.filter((order) => order.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }

      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });

      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete order");
      }

      // Update local state
      setOrders(orders.filter((order) => order.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }

      toast({
        title: "Success",
        description: "Order deleted successfully",
      });

      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  const getOrderTotal = (order: Order) => {
    // Use total_amount if available
    if (order.total_amount !== undefined && order.total_amount !== null) {
      return toNumber(order.total_amount);
    }

    // Use order_total if available
    if (order.order_total !== undefined && order.order_total !== null) {
      return toNumber(order.order_total);
    }

    // If we have items array, calculate from items
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      return order.items.reduce((total, item) => {
        return total + toNumber(item.quantity) * toNumber(item.unit_price);
      }, 0);
    }

    // Fallback to 0
    return 0;
  };

  const filteredOrders = orders.filter((order) => {
    // Search in order items if they exist
    const itemSearchMatch =
      order.items && Array.isArray(order.items) && order.items.length > 0
        ? order.items.some((item) =>
            item.product_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()),
          )
        : false;

    const matchesSearch =
      order.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone?.includes(searchQuery) ||
      order.payment_reference
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      itemSearchMatch ||
      // For backward compatibility
      order.product_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStore =
      storeFilter === "all" ||
      (order.items && Array.isArray(order.items) && order.items.length > 0
        ? order.items.some((item) => item.store_name === storeFilter)
        : order.store === storeFilter);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStore && matchesStatus;
  });

  // Order Detail View
  if (selectedOrder) {
    const orderTotal = getOrderTotal(selectedOrder);
    const formattedDate = new Date(
      selectedOrder.created_at,
    ).toLocaleDateString();
    const expiresDate = selectedOrder.expires_at
      ? new Date(selectedOrder.expires_at).toLocaleDateString()
      : "N/A";

    return (
      <AdminLayout>
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
              {/* Mark as Paid button - only show for AWAITING_PAYMENT orders */}
              {canMarkAsPaid(selectedOrder) && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateOrderStatus(selectedOrder.id, "PAID")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
              )}

              {/* Cancel Order button - only show for cancellable orders */}
              {canCancelOrder(selectedOrder) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to cancel this order?",
                      )
                    ) {
                      updateOrderStatus(selectedOrder.id, "CANCELLED");
                    }
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              )}

              {/* Delete Order button - show for deletable orders */}
              {canDeleteOrder(selectedOrder) && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this order? This action cannot be undone.",
                      )
                    ) {
                      deleteOrder(selectedOrder.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Order
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
                    User ID: {selectedOrder.user_id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: <StatusBadge status={selectedOrder.status} />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Items:{" "}
                    {selectedOrder.item_count ||
                      selectedOrder.items?.length ||
                      0}
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
                    <span className="capitalize">
                      Contact:{" "}
                      {(
                        selectedOrder.preferred_contact || "whatsapp"
                      )?.toLowerCase()}
                    </span>
                  </div>
                  {selectedOrder.telegram_username && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="ml-7">
                        Telegram: @{selectedOrder.telegram_username}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Order Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details - #{selectedOrder.id}
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
                    {/* Order Items List */}
                    <div className="space-y-4 mb-6">
                      <h3 className="font-semibold">
                        Order Items ({selectedOrder.items?.length || 0})
                      </h3>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, index) => {
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
                                      Store: {item.store_name || "Unknown"}
                                    </p>
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
                          No items found for this order
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                      <div>
                        <p className="text-muted-foreground">Total Items</p>
                        <p className="font-medium">
                          {selectedOrder.items?.length || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Amount</p>
                        <p className="font-medium">ETB {orderTotal.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Order Date</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formattedDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expires</p>
                        <p className="font-medium">{expiresDate}</p>
                      </div>
                      {selectedOrder.payment_reference && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">
                            Payment Reference
                          </p>
                          <p className="font-mono font-medium">
                            {selectedOrder.payment_reference}
                          </p>
                        </div>
                      )}
                      {selectedOrder.payment_method && (
                        <div className="col-span-2">
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
                        {canMarkAsPaid(selectedOrder) && (
                          <Button
                            className="btn-brand flex-1"
                            onClick={() =>
                              updateOrderStatus(selectedOrder.id, "PAID")
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </Button>
                        )}

                        {canCancelOrder(selectedOrder) && (
                          <Button
                            variant="outline"
                            className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to cancel this order?",
                                )
                              ) {
                                updateOrderStatus(
                                  selectedOrder.id,
                                  "CANCELLED",
                                );
                              }
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </Button>
                        )}

                        {canDeleteOrder(selectedOrder) && (
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this order? This action cannot be undone.",
                                )
                              ) {
                                deleteOrder(selectedOrder.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Order
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, product, or payment reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={storeFilter} onValueChange={setStoreFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-background">
              <SelectValue placeholder="Filter by store" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="all">All Stores</SelectItem>
              {stores.map((store, index) => (
                <SelectItem key={index} value={store}>
                  {store.charAt(0).toUpperCase() + store.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="AWAITING_PAYMENT">Awaiting Payment</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="card-minimal overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="table-header">Customer</TableHead>
                <TableHead className="table-header">Items</TableHead>
                <TableHead className="table-header">Store(s)</TableHead>
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
                    colSpan={8}
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
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {Array.isArray(orders) && orders.length === 0
                      ? "No orders found"
                      : "No orders match your filters"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const orderTotal = getOrderTotal(order);
                  const formattedDate = new Date(
                    order.created_at,
                  ).toLocaleDateString();

                  // Calculate total quantity
                  const totalQuantity =
                    order.items?.reduce(
                      (total, item) => total + toNumber(item.quantity),
                      0,
                    ) || 0;

                  // Get unique stores
                  const stores =
                    order.items
                      ?.map((item) => item.store_name)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index,
                      ) || [];

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
                            {order.item_count || order.items?.length || 0}{" "}
                            item(s)
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
                      <TableCell className="table-cell capitalize">
                        {stores.slice(0, 2).join(", ") || "No store"}
                        {stores.length > 2 && ` +${stores.length - 2}`}
                      </TableCell>
                      <TableCell className="table-cell">
                        {totalQuantity}
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
                          {canMarkAsPaid(order) && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOrderStatus(order.id, "PAID");
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Paid
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchOrderDetails(order.id);
                            }}
                          >
                            View
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
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
