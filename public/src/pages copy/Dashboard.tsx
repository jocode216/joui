import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Package,
  ShoppingBag,
  User,
  Loader2,
  LogOut,
  Menu,
  Phone,
  MapPin,
  MessageSquare,
  Calendar,
  ShoppingCart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/layout/Footer";

const API_BASE_URL = "https://storemy.josephteka.com/api";

// Type definitions
interface User {
  id: number;
  first_name: string;
  last_name?: string;
  phone: string;
  address: string;
  preferred_contact: "CALL" | "WHATSAPP" | "TELEGRAM";
  telegram_username?: string;
  created_at: string;
}

interface OrderItem {
  product_id: number;
  product_name: string;
  description?: string;
  image_url?: string;
  category?: string;
  quantity: number;
  unit_price: number;
  item_total?: number;
}

interface Order {
  id: number;
  status:
    | "AWAITING_PAYMENT"
    | "PAID"
    | "CANCELLED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "REFUNDED"
    | "EXPIRED";
  total_amount?: number | string | null;
  order_total?: number | string | null;
  created_at: string;
  expires_at?: string;
  items?: OrderItem[];
  item_count?: number;
  product_name?: string;
  quantity?: number;
  unit_price?: number;
}

interface TransformedOrder {
  id: number;
  orderId: string;
  date: string;
  total: number;
  status: Order["status"];
  product_name: string;
  quantity: string;
  items?: OrderItem[];
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
    fetchUserOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user data");
      }

      if (data.success && data.data) {
        setUser(data.data);
      } else if (data.id) {
        setUser(data);
      } else {
        throw new Error(data.error || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setOrdersLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      console.log("Orders data received:", JSON.stringify(data, null, 2)); // Debug log

      if (data.success && data.data) {
        setOrders(data.data);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.warn("Unexpected orders response format:", data);
        toast({
          title: "Warning",
          description: "Could not load orders in expected format",
          variant: "default",
        });
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load order history",
        variant: "destructive",
      });
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userName");

    setUser(null);
    setOrders([]);

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });

    navigate("/");
  };

  // Get order status statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "AWAITING_PAYMENT",
  ).length;
  const paidOrders = orders.filter((order) => order.status === "PAID").length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED",
  ).length;

  // Calculate total spent safely - only count PAID orders (completed/confirmed orders)
  const paidStatuses: Order["status"][] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
  const totalSpent = orders
    .filter((order) => paidStatuses.includes(order.status))
    .reduce((total, order) => {
      let orderTotal = 0;

      if (order.order_total !== null && order.order_total !== undefined) {
        if (typeof order.order_total === "number") {
          orderTotal = order.order_total;
        } else if (typeof order.order_total === "string") {
          orderTotal = parseFloat(order.order_total) || 0;
        }
      } else if (
        order.total_amount !== null &&
        order.total_amount !== undefined
      ) {
        if (typeof order.total_amount === "number") {
          orderTotal = order.total_amount;
        } else if (typeof order.total_amount === "string") {
          orderTotal = parseFloat(order.total_amount) || 0;
        }
      }

      return total + orderTotal;
    }, 0);

  // Get product name for display
  const getProductDisplayName = (order: Order): string => {
    // If we have items with product details
    if (order.items && order.items.length > 0) {
      if (order.items.length === 1) {
        // Single item - show product name
        return order.items[0].product_name || "Product";
      } else {
        // Multiple items - show count
        return `${order.items.length} items`;
      }
    }

    // Fallback to order.product_name if available
    if (order.product_name) {
      return order.product_name;
    }

    // Default fallback
    return "View details for items";
  };

  // Get quantity display text
  const getQuantityDisplay = (order: Order): string => {
    // If we have items
    if (order.items && order.items.length > 0) {
      const totalQuantity = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      return order.items.length === 1
        ? `${order.items[0].quantity} item(s)`
        : `${totalQuantity} total items`;
    }

    // Fallback to order.quantity if available
    if (order.quantity) {
      return `${order.quantity} item(s)`;
    }

    // Default fallback
    return "Multiple items";
  };

  // Transform order data for display
  const transformOrders = (ordersData: Order[]): TransformedOrder[] => {
    return ordersData.map((order) => {
      // Safely handle total
      let total = 0;

      if (order.order_total !== null && order.order_total !== undefined) {
        if (typeof order.order_total === "number") {
          total = order.order_total;
        } else if (typeof order.order_total === "string") {
          total = parseFloat(order.order_total) || 0;
        }
      } else if (
        order.total_amount !== null &&
        order.total_amount !== undefined
      ) {
        if (typeof order.total_amount === "number") {
          total = order.total_amount;
        } else if (typeof order.total_amount === "string") {
          total = parseFloat(order.total_amount) || 0;
        }
      }

      return {
        id: order.id,
        orderId: `ORD-${order.id}`,
        date: new Date(order.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        total: total,
        status: order.status,
        product_name: getProductDisplayName(order),
        quantity: getQuantityDisplay(order),
        items: order.items,
      };
    });
  };

  const transformedOrders = transformOrders(orders);

  // Mobile-friendly order row component
  const MobileOrderRow = ({ order }: { order: TransformedOrder }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex items-start gap-3">
            <div className="h-16 w-16 rounded-md bg-secondary flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium line-clamp-2">{order.product_name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={order.status} />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Date</span>
              </div>
              <p>{order.date}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <ShoppingBag className="h-3 w-3" />
                <span>Qty</span>
              </div>
              <p>{order.quantity}</p>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Total</div>
              <p className="font-medium">ETB {order.total.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-xs">{order.orderId}</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-border">
            <Link to={`/orders/${order.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Mobile Action Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle>Quick Actions</SheetTitle>
                  </SheetHeader>
                  <div className="py-6 space-y-4">
                    <Link
                      to="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Browse Products
                      </Button>
                    </Link>
                    <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View Cart
                      </Button>
                    </Link>
                    <Link
                      to="/profile/edit"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                    {user && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-lg font-semibold">My Account</h1>
            </div>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.first_name
                          ? user.first_name[0].toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user.first_name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.phone}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/edit">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <main className="px-4 py-6 md:py-8">
        <div className="container mx-auto">
          <h1 className="hidden lg:block text-2xl md:text-3xl font-semibold mb-6 lg:mb-8">
            My Account
          </h1>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Profile Information</CardTitle>
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="hidden lg:flex text-destructive hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Loading profile...</p>
                  </div>
                ) : user ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {user.first_name
                            ? user.first_name[0].toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">
                        {user.first_name || "User"}
                      </h3>

                      <div className="mt-4 space-y-3 w-full">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {user.phone}
                          </span>
                        </div>

                        {user.preferred_contact && (
                          <div className="flex items-center justify-center gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground capitalize">
                              Prefers: {user.preferred_contact.toLowerCase()}
                            </span>
                          </div>
                        )}

                        {user.telegram_username && (
                          <div className="flex items-center justify-center gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Telegram: @{user.telegram_username}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium text-sm">
                            Delivery Address
                          </h4>
                        </div>
                        <p className="text-sm whitespace-pre-line bg-muted/50 p-3 rounded-md min-h-[80px]">
                          {user.address || "No address provided"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6 hidden lg:block">
                      <Link to="/profile/edit" className="w-full">
                        <Button variant="outline" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <User className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Please login to view your profile
                    </p>
                    <Link to="/login">
                      <Button className="btn-brand">Login</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Orders Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <Card>
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="space-y-2">
                      <p className="text-xl sm:text-2xl font-semibold">
                        {totalOrders}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Total Orders
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="space-y-2">
                      <p className="text-xl sm:text-2xl font-semibold">
                        ETB {totalSpent.toFixed(2)}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Total Spent
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="space-y-2">
                      <p className="text-xl sm:text-2xl font-semibold">
                        {pendingOrders}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Awaiting Payment
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="space-y-2">
                      <p className="text-xl sm:text-2xl font-semibold">
                        {paidOrders}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Paid
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order History */}
              <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg">Order History</CardTitle>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Link to="/products" className="flex-1 sm:flex-none">
                      <Button size="sm" className="btn-brand w-full sm:w-auto">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Shop Now
                      </Button>
                    </Link>
                    <Link
                      to="/cart"
                      className="flex-1 sm:flex-none hidden sm:block"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View Cart
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                      <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                  ) : transformedOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No orders yet
                      </p>
                      <Link to="/products">
                        <Button className="btn-brand">Browse Products</Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden lg:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="table-header">
                                Items
                              </TableHead>
                              <TableHead className="table-header">
                                Total(ETB)
                              </TableHead>
                              <TableHead className="table-header">
                                Status
                              </TableHead>
                              <TableHead className="table-header">
                                Date
                              </TableHead>
                              <TableHead className="table-header">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transformedOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="table-cell">
                                  <div className="flex items-center gap-3">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <span className="line-clamp-1">
                                      {order.product_name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="table-cell font-medium">
                                  ETB {order.total.toFixed(2)}
                                </TableCell>
                                <TableCell className="table-cell">
                                  <StatusBadge status={order.status} />
                                </TableCell>
                                <TableCell className="table-cell text-muted-foreground">
                                  {order.date}
                                </TableCell>
                                <TableCell className="table-cell">
                                  <Link to={`/orders/${order.id}`}>
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="lg:hidden">
                        {transformedOrders.map((order) => (
                          <MobileOrderRow key={order.id} order={order} />
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions - Desktop only */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <Link to="/products">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Browse Products</p>
                          <p className="text-sm text-muted-foreground">
                            Shop for new items
                          </p>
                        </div>
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/cart">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">View Cart</p>
                          <p className="text-sm text-muted-foreground">
                            Manage your cart items
                          </p>
                        </div>
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Mobile Bottom Navigation */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t py-3 px-4 shadow-lg">
                <div className="grid grid-cols-3 gap-2">
                  <Link to="/products">
                    <Button
                      variant="ghost"
                      className="w-full h-auto py-2 flex-col gap-1"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span className="text-xs">Shop</span>
                    </Button>
                  </Link>
                  <Link to="/cart">
                    <Button
                      variant="ghost"
                      className="w-full h-auto py-2 flex-col gap-1"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span className="text-xs">Cart</span>
                    </Button>
                  </Link>
                  <Link to="/profile/edit">
                    <Button
                      variant="ghost"
                      className="w-full h-auto py-2 flex-col gap-1"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-xs">Profile</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
