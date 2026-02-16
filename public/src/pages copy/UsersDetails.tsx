import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Package, 
  ShoppingBag, 
  MessageCircle,
  Mail,
  DollarSign,
  Loader2 
} from 'lucide-react';

const API_BASE_URL = 'https://storemy.josephteka.com/api';

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
  status: string;
  total_amount?: number | string | null;
  order_total?: number | string | null;
  created_at: string;
  items?: OrderItem[];
  item_count?: number;
  product_name?: string;
  quantity?: number;
  unit_price?: number;
}

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  phone: string;
  address: string;
  preferred_contact: string;
  telegram_username?: string;
  created_at: string;
}

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetchUserData();
      fetchUserOrders();
    }
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setUser(data.data);
      } else if (data.id) {
        setUser(data);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error: any) {
      console.error('Error fetching user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load user information',
        variant: 'destructive',
      });
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/orders/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user orders: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        setOrders(data.data);
      } else {
        console.warn('Unexpected orders response format:', data);
        setOrders([]);
      }
    } catch (error: any) {
      console.error('Error fetching user orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user orders',
        variant: 'destructive',
      });
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getInitials = (name: string): string => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const getContactIcon = (contactMethod: string) => {
    switch (contactMethod) {
      case 'WHATSAPP':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'TELEGRAM':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'CALL':
        return <Phone className="h-4 w-4 text-gray-500" />;
      default:
        return <Phone className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateUserStats = () => {
    const totalOrders = orders.length;
    
    const totalSpent = orders.reduce((total, order) => {
      let orderTotal = 0;
      
      if (order.order_total !== null && order.order_total !== undefined) {
        if (typeof order.order_total === 'number') {
          orderTotal = order.order_total;
        } else if (typeof order.order_total === 'string') {
          orderTotal = parseFloat(order.order_total) || 0;
        }
      } else if (order.total_amount !== null && order.total_amount !== undefined) {
        if (typeof order.total_amount === 'number') {
          orderTotal = order.total_amount;
        } else if (typeof order.total_amount === 'string') {
          orderTotal = parseFloat(order.total_amount) || 0;
        }
      }
      
      return total + orderTotal;
    }, 0);
    
    const pendingOrders = orders.filter(o => o.status === 'AWAITING_PAYMENT').length;
    const paidOrders = orders.filter(o => o.status === 'PAID').length;
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;

    return { totalOrders, totalSpent, pendingOrders, paidOrders, cancelledOrders };
  };

  // Get product name from order with better handling
  const getProductNameFromOrder = (order: Order): string => {
    if (order.items && order.items.length > 0) {
      const firstItem = order.items[0];
      if (order.items.length === 1) {
        return firstItem.product_name || 'Product';
      } else {
        return `${order.items.length} items`;
      }
    }
    
    // If no items but we have order_total > 0, show generic name
    const orderTotal = getOrderTotal(order);
    if (orderTotal > 0) {
      return `Order #${order.id}`;
    }
    
    return 'No items';
  };

  // Get total items count
  const getTotalItems = (order: Order): number => {
    if (order.items && order.items.length > 0) {
      return order.items.reduce((total, item) => total + (item.quantity || 0), 0);
    }
    
    return 0;
  };

  // Get order total amount
  const getOrderTotal = (order: Order): number => {
    if (order.order_total !== null && order.order_total !== undefined) {
      if (typeof order.order_total === 'number') {
        return order.order_total;
      } else if (typeof order.order_total === 'string') {
        return parseFloat(order.order_total) || 0;
      }
    }
    
    if (order.total_amount !== null && order.total_amount !== undefined) {
      if (typeof order.total_amount === 'number') {
        return order.total_amount;
      } else if (typeof order.total_amount === 'string') {
        return parseFloat(order.total_amount) || 0;
      }
    }
    
    return 0;
  };

  const stats = calculateUserStats();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">User Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The user you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/admin/users')}>
            Back to Users
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getShortDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/users')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Users
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {user.first_name || 'User'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Member since {formatDate(user.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {getInitials(user.first_name)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{user.first_name} {user.last_name || ''}</h2>
                  <p className="text-muted-foreground">{user.phone}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {getContactIcon(user.preferred_contact)}
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Contact</p>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          {user.preferred_contact?.toLowerCase()}
                        </span>
                        {user.telegram_username && user.preferred_contact === 'TELEGRAM' && (
                          <span className="text-sm text-blue-600">
                            @{user.telegram_username}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                      <p className="text-sm whitespace-pre-line">{user.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  User Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Orders</span>
                  <span className="font-semibold">{stats.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-semibold flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {stats.totalSpent.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Awaiting Payment</span>
                  <span className="font-semibold text-amber-600">{stats.pendingOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Paid Orders</span>
                  <span className="font-semibold text-green-600">{stats.paidOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cancelled Orders</span>
                  <span className="font-semibold text-red-600">{stats.cancelledOrders}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Order History</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {orders.length} orders
                </span>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="table-header">Items</TableHead>
                          <TableHead className="table-header">Total</TableHead>
                          <TableHead className="table-header">Status</TableHead>
                          <TableHead className="table-header">Date</TableHead>
                          <TableHead className="table-header text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => {
                          const formattedDate = getShortDate(order.created_at);
                          const productName = getProductNameFromOrder(order);
                          const totalItems = getTotalItems(order);
                          const orderTotal = getOrderTotal(order);
                          
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="table-cell">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <span className="font-medium block">
                                      {productName}
                                    </span>
                                    {order.items && order.items.length > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        {totalItems} item{totalItems !== 1 ? 's' : ''}
                                      </span>
                                    )}
                                  </div>
                                </div>
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
                                <Link to={`/orders/${order.id}`}>
                                  <Button variant="ghost" size="sm">
                                    View Details
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetails;