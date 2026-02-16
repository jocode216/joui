import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, PlusCircle, AlertCircle, CheckCircle, XCircle, Clock, Package, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import { storeService } from '@/lib/storeService';

interface UserStore {
  id: number;
  name: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  rejection_reason?: string;
  product_count: number;
  total_inventory: number;
  is_active: boolean;
  created_at: string;
}

const UserStores = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stores, setStores] = useState<UserStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchUserStores(userId);
  }, [navigate]);

  const fetchUserStores = async (userId: string) => {
    try {
      setLoading(true);
      const response = await storeService.getStoresByOwner(userId);
      setStores(response.data as unknown as UserStore[] || []);
    } catch (error: any) {
      console.error('Failed to fetch stores:', error);
      // Don't show error if user just doesn't have stores
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'SUSPENDED':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Store className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-orange-100 text-orange-800',
    };
    return <Badge className={styles[status] || 'bg-muted'}>{status}</Badge>;
  };

  const getStatusMessage = (store: UserStore) => {
    switch (store.status) {
      case 'PENDING':
        return 'Your store is awaiting admin approval. You will be notified once reviewed.';
      case 'APPROVED':
        return 'Your store is active! You can now add products and manage orders.';
      case 'REJECTED':
        return `Your store was rejected. Reason: ${store.rejection_reason || 'No reason provided'}`;
      case 'SUSPENDED':
        return 'Your store has been suspended. Please contact support for more information.';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading stores...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">My Store</h1>
            <p className="text-muted-foreground">Manage your seller store</p>
          </div>
          {stores.length === 0 && (
            <Link to="/createstore">
              <Button className="btn-brand">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Store
              </Button>
            </Link>
          )}
        </div>

        {stores.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Store Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your own store to start selling products on Kanaho
              </p>
              <Link to="/createstore">
                <Button className="btn-brand">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your Store
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(store.status)}
                      <div>
                        <CardTitle>{store.name}</CardTitle>
                        {store.description && (
                          <CardDescription>{store.description}</CardDescription>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(store.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Status Message */}
                  <div className={`p-4 rounded-lg mb-6 ${
                    store.status === 'APPROVED' ? 'bg-green-50' :
                    store.status === 'PENDING' ? 'bg-yellow-50' :
                    store.status === 'REJECTED' ? 'bg-red-50' : 'bg-orange-50'
                  }`}>
                    <p className={`text-sm ${
                      store.status === 'APPROVED' ? 'text-green-700' :
                      store.status === 'PENDING' ? 'text-yellow-700' :
                      store.status === 'REJECTED' ? 'text-red-700' : 'text-orange-700'
                    }`}>
                      {getStatusMessage(store)}
                    </p>
                  </div>

                  {/* Store Stats */}
                  {store.status === 'APPROVED' && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-semibold">{store.product_count || 0}</p>
                        <p className="text-sm text-muted-foreground">Products</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-semibold">{store.total_inventory || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Stock</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-semibold">
                          {new Date(store.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-sm text-muted-foreground">Created</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {store.status === 'APPROVED' && (
                      <>
                        <Link to="/store">
                          <Button className="btn-brand">
                            <Store className="h-4 w-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link to="/store/products">
                          <Button variant="outline">
                            <Package className="h-4 w-4 mr-2" />
                            Products
                          </Button>
                        </Link>
                        <Link to="/store/products/create">
                          <Button variant="outline">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Product
                          </Button>
                        </Link>
                      </>
                    )}
                    <Link to={`/editstore?id=${store.id}`}>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Store
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStores;
