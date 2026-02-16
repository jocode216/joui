import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { ChevronLeft, Calendar, Loader2, Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "@/components/layout/Footer";

const API_BASE_URL = "https://storemy.josephteka.com/api";

// Type definitions
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  store?: string;
  category?: string;
}

interface UserData {
  first_name: string;
  phone: string;
  address: string;
  preferred_contact: "CALL" | "WHATSAPP" | "TELEGRAM";
  telegram_username?: string;
}

interface OrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
  message?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();

  const [expiresAt, setExpiresAt] = useState<string>("");
  const [preferredContact, setPreferredContact] = useState<
    "CALL" | "WHATSAPP" | "TELEGRAM"
  >("WHATSAPP");
  const [telegramUsername, setTelegramUsername] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Calculate expiration date (default: 24 hours from now)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0); // Set to 12 PM tomorrow
    setExpiresAt(tomorrow.toISOString().slice(0, 16)); // Format for datetime-local input
  }, []);

  // Get user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        toast({
          title: "Please login",
          description: "You need to login to place an order",
          variant: "destructive",
        });
        navigate("/login", { state: { from: "/cart" } });
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (data.success && data.data) {
          setUserData(data.data);
          setPreferredContact(data.data.preferred_contact || "WHATSAPP");
          setTelegramUsername(data.data.telegram_username || "");
        } else {
          throw new Error(data.error || "Failed to load user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user information",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) {
      toast({
        title: "Error",
        description: "User information not loaded",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      toast({
        title: "Please login",
        description: "You need to login to place an order",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    setLoading(true);

    try {
      // Check for existing AWAITING_PAYMENT orders in the last 24 hours
      const ordersResponse = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (ordersResponse.ok) {
        const data = await ordersResponse.json();
        const orders = Array.isArray(data) ? data : data.data || [];
        
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const awaitingPaymentOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.created_at);
          return (
            order.status === "AWAITING_PAYMENT" &&
            orderDate > twentyFourHoursAgo
          );
        });

        if (awaitingPaymentOrders.length >= 3) {
          toast({
            title: "Order Limit Exceeded",
            description: "You cannot have more than 3 awaiting payment orders within 24 hours. Please complete payment for your existing orders or cancel them before placing a new one.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // Create a single order with multiple items
      const orderData = {
        items: items.map((item: CartItem) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        payment_method: "MANUAL",
      };
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

    const result: OrderResponse = await response.json();

    if (!response.ok) {
      console.error("Order creation failed:", result);
      throw new Error(result.error || "Failed to create order");
    }

    if (!result.success) {
      throw new Error(result.error || "Failed to create order");
    }

    // Clear cart on success
    clearCart();

    toast({
      title: "Order Placed Successfully!",
      description: `Order #${result.orderId} has been created with ${items.length} items.`,
    });

    // Navigate to order details or dashboard
    navigate(`/orders/${result.orderId}`);
  } catch (error) {
    const err = error as Error;
    console.error("Error creating order:", err);
    toast({
      title: "Error",
      description: err.message || "Failed to place order. Please try again.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding py-16">
          <div className="container mx-auto text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-semibold mb-2">
              No items to checkout
            </h1>
            <p className="text-muted-foreground mb-6">
              Your cart is empty. Add some products first.
            </p>
            <Button className="btn-brand" onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-8">
            Review your order and complete the purchase
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card-minimal p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items ({items.length})
                </h2>

                <div className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 pb-4 border-b border-border last:border-0"
                    >
                      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                        <img
                          src={item.image_url || "/placeholder-image.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium line-clamp-1">
                              {item.name}
                            </h3>
                            {item.store && (
                              <p className="text-sm text-muted-foreground capitalize">
                                {item.store}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>

                        {item.category && (
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            {item.category}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span>{items.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Quantity
                      </span>
                      <span>
                        {items.reduce(
                          (total: number, item: CartItem) =>
                            total + item.quantity,
                          0,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                      <span>Total Amount</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="card-minimal p-6">
                <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
                <Textarea
                  placeholder="Any special instructions for your order? (Optional)"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Order Details & Submit */}
            <div className="lg:col-span-1">
              <div className="card-minimal p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-6">Complete Order</h2>

                {/* User Info */}
                {userData && (
                  <div className="space-y-4 mb-6 pb-6 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Customer
                      </p>
                      <p className="font-medium">{userData.first_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Phone
                      </p>
                      <p className="font-medium">{userData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Address
                      </p>
                      <p className="text-sm whitespace-pre-line">
                        {userData.address}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contact Method */}
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="preferredContact">
                      Preferred Contact Method
                    </Label>
                    <Select
                      value={preferredContact}
                      onValueChange={(
                        value: "CALL" | "WHATSAPP" | "TELEGRAM",
                      ) => setPreferredContact(value)}
                    >
                      <SelectTrigger className="bg-background mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                        <SelectItem value="CALL">Phone Call</SelectItem>
                        <SelectItem value="TELEGRAM">Telegram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {preferredContact === "TELEGRAM" && (
                    <div>
                      <Label htmlFor="telegramUsername">
                        Telegram Username
                      </Label>
                      <Input
                        id="telegramUsername"
                        placeholder="@username"
                        value={telegramUsername}
                        onChange={(e) => setTelegramUsername(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                {/* Order Expiration */}
                <div className="space-y-2 mb-8">
                  <Label htmlFor="expiresAt" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Order Expires At
                  </Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {expiresAt &&
                      `Order will expire on: ${formatDate(expiresAt)}`}
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full btn-brand"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading || !userData}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
