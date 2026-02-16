import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Package,
  Clock,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://storemy.josephteka.com/api";

interface DashboardStatsResponse {
  success: boolean;
  data: {
    stats: {
      totalOrders: number;
      totalSales: number;
      pendingOrders: number;
      totalProducts: number;
      totalCustomers: number;
      activeUsers: number;
      totalStores?: number;
      approvedStores?: number;
      pendingStores?: number;
      availableInventory?: number;
    };
    userRole: string;
  };
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    activeUsers: 0,
    totalStores: 0,
    approvedStores: 0,
    pendingStores: 0,
    availableInventory: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getAuthToken = (): string | null => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the dashboard",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch dashboard stats");

      const result: DashboardStatsResponse = await response.json();

      if (result.success && result.data) {
        setStats({
          totalOrders: result.data.stats.totalOrders || 0,
          totalSales: result.data.stats.totalSales || 0,
          pendingOrders: result.data.stats.pendingOrders || 0,
          totalProducts: result.data.stats.totalProducts || 0,
          totalCustomers: result.data.stats.totalCustomers || 0,
          activeUsers: result.data.stats.activeUsers || 0,
          totalStores: result.data.stats.totalStores || 0,
          approvedStores: result.data.stats.approvedStores || 0,
          pendingStores: result.data.stats.pendingStores || 0,
          availableInventory: result.data.stats.availableInventory || 0,
        });
        setUserRole(result.data.userRole || "");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">
              {userRole === "ADMIN" ? "Admin" : "Store Owner"} Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back to Kanaho</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Loader2 className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            icon={<ShoppingCart className="h-5 w-5" />}
          />
          <StatCard
            title="Total Sales"
            value={formatCurrency(stats.totalSales)}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders.toString()}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts.toString()}
            icon={<Package className="h-5 w-5" />}
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers.toString()}
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        {/* Store Overview section only for Admin */}
        {userRole === "ADMIN" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Store Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-accent p-4 rounded-lg">
                  <div className="text-2xl font-bold">{stats.totalStores}</div>
                  <div className="text-sm text-muted-foreground">Total Stores</div>
                </div>
                <div className="bg-accent p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.approvedStores}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                <div className="bg-accent p-4 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">{stats.pendingStores}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="bg-accent p-4 rounded-lg">
                  <div className="text-2xl font-bold">{stats.availableInventory}</div>
                  <div className="text-sm text-muted-foreground">Inventory Items</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;