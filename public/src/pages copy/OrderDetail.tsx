import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  Package,
  Calendar,
  User,
  Phone,
  MapPin,
  DollarSign,
  ShoppingBag,
  Loader2,
  Clock,
  Store,
  Tag,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

const API_BASE_URL = "https://storemy.josephteka.com/api";

// Type definitions
interface OrderItem {
  product_id: number;
  product_name: string;
  description?: string;
  brand?: string;
  category?: string;
  quantity: number;
  unit_price: any; // Changed from number to any to handle string/number
  image_url?: string;
  store_name?: string;
}

interface OrderData {
  id: number;
  user_id: number;
  status: "AWAITING_PAYMENT" | "PAID" | "CANCELLED";
  expires_at: string;
  created_at: string;
  payment_reference?: string;
  first_name: string;
  last_name?: string;
  phone: string;
  address: string;
  preferred_contact: "CALL" | "WHATSAPP" | "TELEGRAM";
  telegram_username?: string;
  items: OrderItem[];
  totalAmount?: number;
}

interface ApiResponse {
  success: boolean;
  data?: OrderData;
  error?: string;
  message?: string;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found");
        }
        throw new Error(data.error || "Failed to fetch order details");
      }

      if (data.success && data.data) {
        // Ensure unit_price is a number for all items
        const processedData = {
          ...data.data,
          items: data.data.items.map((item: any) => ({
            ...item,
            unit_price: typeof item.unit_price === 'string' 
              ? parseFloat(item.unit_price) 
              : item.unit_price
          }))
        };
        setOrder(processedData);
      } else {
        throw new Error(data.error || "Failed to load order");
      }
    } catch (error) {
      const err = error as Error;
      console.error("Error fetching order:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load order details",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const updateOrderStatus = async (newStatus: OrderData["status"]) => {
    if (!id || !order) return;

    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
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

      if (!data.success) {
        throw new Error(data.error || "Failed to update order status");
      }

      // Update local state
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus.toLowerCase()}`,
      });

      // If cancelled, refresh to update reserved quantity
      if (newStatus === "CANCELLED") {
        await fetchOrder();
      }
    } catch (error) {
      const err = error as Error;
      console.error("Error updating order status:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderTotal = () => {
    if (!order || !order.items || order.items.length === 0) return 0;
    return order.items.reduce(
      (total, item) => {
        const price = typeof item.unit_price === 'number' 
          ? item.unit_price 
          : parseFloat(item.unit_price) || 0;
        return total + item.quantity * price;
      },
      0,
    );
  };

  // Helper function to safely format price
  const formatPrice = (price: any): string => {
    if (price === null || price === undefined) return "0.00";
    
    const numPrice = typeof price === 'number' 
      ? price 
      : parseFloat(price);
    
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  // Helper function to calculate subtotal safely
  const calculateSubtotal = (quantity: number, unitPrice: any): number => {
    const price = typeof unitPrice === 'number' 
      ? unitPrice 
      : parseFloat(unitPrice) || 0;
    return quantity * price;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding py-16">
          <div className="container mx-auto text-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">
              Loading Order Details
            </h1>
            <p className="text-muted-foreground">Please wait...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding py-16">
          <div className="container mx-auto text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const orderTotal = getOrderTotal();
  const formattedCreatedDate = formatDate(order.created_at);
  const formattedExpiresDate = formatDate(order.expires_at);
  const isExpired = new Date(order.expires_at) < new Date();

  // Get first item for display (if exists)
  const firstItem =
    order.items && order.items.length > 0 ? order.items[0] : null;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/placeholder-image.jpg";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="section-padding py-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Orders
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">
                  Order 
                </h1>
                <p className="text-muted-foreground mt-1">
                  Placed on {formattedCreatedDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.status} />
              {isExpired && order.status === "AWAITING_PAYMENT" && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  Expired
                </span>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items ({order.items?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!order.items || order.items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No items in this order
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-6 pb-6 border-b border-border last:border-0 last:pb-0"
                        >
                          <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                            <img
                              src={item.image_url || "/placeholder-image.jpg"}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          </div>

                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className="text-xl font-semibold">
                                {item.product_name}
                              </h3>
                              {item.brand && (
                                <p className="text-muted-foreground">
                                  Brand: {item.brand}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-muted-foreground">
                                    Category
                                  </p>
                                  <p className="font-medium capitalize">
                                    {item.category || "Uncategorized"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Store className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-muted-foreground">Store</p>
                                  <p className="font-medium capitalize">
                                    {item.store_name || "No store"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {item.description && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Description
                                </p>
                                <p className="text-sm">{item.description}</p>
                              </div>
                            )}

                            <div className="flex justify-between items-center pt-4">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  Unit Price
                                </p>
                                <p className="text-lg font-semibold">
                                  ${formatPrice(item.unit_price)}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  Quantity
                                </p>
                                <p className="text-lg font-semibold">
                                  {item.quantity}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  Subtotal
                                </p>
                                <p className="text-lg font-semibold">
                                  ${calculateSubtotal(item.quantity, item.unit_price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <h4 className="font-semibold mb-4">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Items Total
                        </span>
                        <span>${orderTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                        <span>Total Amount</span>
                        <span className="text-2xl font-bold text-primary">
                          ${orderTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-muted-foreground">
                          {formattedCreatedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            order.status === "PAID" ||
                            order.status === "CANCELLED"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <DollarSign
                            className={`h-4 w-4 ${
                              order.status === "PAID" ||
                              order.status === "CANCELLED"
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {order.status === "PAID"
                            ? "Payment Received"
                            : order.status === "CANCELLED"
                              ? "Order Cancelled"
                              : "Awaiting Payment"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.status === "AWAITING_PAYMENT"
                            ? `Payment required before ${formattedExpiresDate}`
                            : `Updated on ${formattedCreatedDate}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Package className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Will be processed after payment confirmation
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Customer & Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="font-medium">
                      {order.first_name} {order.last_name || ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Phone
                      </p>
                      <p className="font-medium">{order.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Address
                      </p>
                      <p className="text-sm whitespace-pre-line">
                        {order.address}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Preferred Contact
                    </p>
                    <p className="font-medium capitalize">
                      {order.preferred_contact?.toLowerCase()}
                    </p>
                  </div>
                  {order.telegram_username && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Telegram
                      </p>
                      <p className="font-medium">@{order.telegram_username}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Order Status
                    </p>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.status} />
                      {isExpired && order.status === "AWAITING_PAYMENT" && (
                        <span className="text-xs text-red-600 font-medium">
                          (Expired)
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Expires At
                    </p>
                    <p className="font-medium">{formattedExpiresDate}</p>
                  </div>

                  {order.payment_reference && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-1">
                        Payment Reference
                      </p>
                      <p className="font-mono text-sm bg-secondary p-2 rounded">
                        {order.payment_reference}
                      </p>
                    </div>
                  )}

                  {firstItem && (
                    <div className="pt-4 border-t border-border">
                      <Link to={`/product/${firstItem.product_id}`}>
                        <Button variant="outline" className="w-full">
                          View First Product
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;