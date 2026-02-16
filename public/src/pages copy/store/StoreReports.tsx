import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/StatCard';
import { DollarSign, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://storemy.josephteka.com/api";

const StoreReports = () => {
  const { toast } = useToast();
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    sales: 0,
    orders: 0,
    avgValue: 0,
  });

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      // 1. Fetch Store Owner's Orders
      const response = await fetch(`${API_BASE_URL}/orders/store-owner/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const allOrders = data.data || [];
          processOrders(allOrders);
        }
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processOrders = (orders: any[]) => {
    const now = new Date();
    const filteredOrders = orders.filter(order => {
      // Filter by status (only completed sales count)
      if (order.status !== 'PAID' && order.status !== 'DELIVERED') return false;

      const orderDate = new Date(order.created_at);
      
      if (timeFilter === 'daily') {
        return orderDate.getDate() === now.getDate() && 
               orderDate.getMonth() === now.getMonth() && 
               orderDate.getFullYear() === now.getFullYear();
      } else if (timeFilter === 'weekly') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= oneWeekAgo;
      } else if (timeFilter === 'monthly') {
        return orderDate.getMonth() === now.getMonth() && 
               orderDate.getFullYear() === now.getFullYear();
      }
      return true;
    });

    const totalOrders = filteredOrders.length;
    // Calculate total sales from order totals
    // Note: Assuming 'order_total' or 'total_amount' is the field. 
    // Logic from StoreOrders: try total_amount then order_total
    const totalSales = filteredOrders.reduce((sum, order) => {
        const amount = parseFloat(order.total_amount || order.order_total || 0);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    setStats({
      sales: totalSales,
      orders: totalOrders,
      avgValue: totalOrders > 0 ? totalSales / totalOrders : 0,
    });
  };

  return (
    <AdminLayout isStoreOwner>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Store Reports</h1>
          <p className="text-muted-foreground mt-1">Your store's performance metrics</p>
        </div>

        {/* Time Filter */}
        <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as typeof timeFilter)}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value={timeFilter} className="space-y-6 mt-6">
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                /* Stats */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title={`${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Sales`}
                    value={`ETB ${stats.sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    subtitle="Your earnings"
                    icon={<DollarSign className="h-5 w-5" />}
                />
                <StatCard
                    title={`${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Orders`}
                    value={stats.orders.toLocaleString()}
                    subtitle="Orders received"
                    icon={<ShoppingCart className="h-5 w-5" />}
                />
                <StatCard
                    title="Avg. Order Value"
                    value={`ETB ${stats.avgValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    subtitle="Per transaction"
                    icon={<TrendingUp className="h-5 w-5" />}
                />
                </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default StoreReports;
