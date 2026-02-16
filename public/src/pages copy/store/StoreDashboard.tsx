import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  ShoppingCart,
  Package,
  PlusCircle,
  Clock,
  CheckCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = "https://storemy.josephteka.com/api";

const StoreDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    todaySales: 0,
    todayOrders: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
    recentOrders: [],
    storeInfo: null,
  });

  useEffect(() => {
    fetchStoreDashboardData();
  }, []);

  const fetchStoreDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "Please login to access dashboard",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Get user ID from localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User information not found");
      }

      // Step 1: Fetch store owner's store
      const storeResponse = await fetch(
        `${API_BASE_URL}/stores/owner/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!storeResponse.ok) {
        throw new Error(`Failed to fetch store: ${storeResponse.status}`);
      }

      const storeData = await storeResponse.json();

      if (
        !storeData.success ||
        !storeData.data ||
        storeData.data.length === 0
      ) {
        toast({
          title: "No Store Found",
          description: "You don't have a store yet. Please create one first.",
          variant: "destructive",
        });
        navigate("/store/create");
        return;
      }

      const store = storeData.data[0];

      // Step 2: Fetch store-specific orders
      const ordersResponse = await fetch(
        `${API_BASE_URL}/orders/store/${store.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!ordersResponse.ok) {
        throw new Error(
          `Failed to fetch store orders: ${ordersResponse.status}`,
        );
      }

      const ordersData = await ordersResponse.json();

      if (!ordersData.success) {
        throw new Error("Failed to fetch orders data");
      }

      // Process only PAID orders for this specific store
      const paidOrders = (ordersData.data || []).filter(
        (order) => order.status === "PAID" || order.status === "DELIVERED",
      );

      // Calculate statistics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayPaidOrders = paidOrders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= today;
      });

      const todaySales = todayPaidOrders.reduce((sum, order) => {
        return sum + (order.total_amount || 0);
      }, 0);

      const totalSales = paidOrders.reduce((sum, order) => {
        return sum + (order.total_amount || 0);
      }, 0);

      // Get all orders for this store (not just paid) for order counts
      const allOrders = ordersData.data || [];
      const completedOrders = allOrders.filter(
        (order) => order.status === "PAID" || order.status === "DELIVERED",
      ).length;

      const pendingOrders = allOrders.filter(
        (order) =>
          order.status === "AWAITING_PAYMENT" || order.status === "PROCESSING",
      ).length;

      // Get recent orders (last 5 paid orders)
      const recentOrders = paidOrders.slice(0, 5).map((order) => ({
        id: order.id,
        customerName:
          order.customer?.full_name ||
          `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`.trim() ||
          `Customer #${order.user_id}`,
        phone: order.customer?.phone || "N/A",
        email: order.customer?.email || "N/A",
        totalAmount: order.total_amount || 0,
        status: order.status,
        createdAt: order.created_at,
        items: order.items || [],
      }));

      setDashboardData({
        todaySales,
        todayOrders: todayPaidOrders.length,
        totalOrders: allOrders.length,
        completedOrders,
        pendingOrders,
        totalSales,
        recentOrders,
        storeInfo: store,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStoreDashboardData();
  };

  const handleAddProduct = () => {
    navigate("/store/products/add");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout isStoreOwner>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading store dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout isStoreOwner>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              {dashboardData.storeInfo
                ? `${dashboardData.storeInfo.name} Dashboard`
                : "Store Dashboard"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your store performance and manage orders
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button
              onClick={handleAddProduct}
              
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Store Status Card */}
        {dashboardData.storeInfo && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {dashboardData.storeInfo.name}
                  </h3>
                  <p className="text-sm text-black-700">
                    {dashboardData.storeInfo.description || "Your store"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`
                    ${
                      dashboardData.storeInfo.status === "APPROVED"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : dashboardData.storeInfo.status === "PENDING"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                    }`}
                  >
                    {dashboardData.storeInfo.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Store ID: {dashboardData.storeInfo.id}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today's Sales */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Today's Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboardData.todaySales)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {dashboardData.todayOrders}{" "}
                {dashboardData.todayOrders === 1 ? "order" : "orders"} today
              </p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalOrders}
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-600">
                    {dashboardData.completedOrders} completed
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-3 w-3 mr-1 text-amber-500" />
                  <span className="text-amber-600">
                    {dashboardData.pendingOrders} pending
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Sales */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboardData.totalSales)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                All-time revenue
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={handleAddProduct}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
                <Button
                  onClick={() => navigate("/store/products")}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Package className="h-4 w-4 mr-2" />
                  View All Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Recent Orders
              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                {dashboardData.recentOrders.length}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/store/orders")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {dashboardData.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">
                              {order.customerName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {order.phone}
                              </span>
                            </div>
                            {order.email !== "N/A" && (
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-muted-foreground truncate max-w-[150px]">
                                  {order.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`
                            ${
                              order.status === "PAID"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : order.status === "DELIVERED"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(order.createdAt)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="max-w-sm mx-auto">
                  Your paid orders will appear here. Start by adding products
                  and promoting your store.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Showing only paid orders from your store. Orders update in
            real-time.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StoreDashboard;
