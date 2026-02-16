import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Store, Package, Search, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import ProductCardRectangular from '@/components/ProductCardRectangular';
import { storeService } from '@/lib/storeService';
import { API_BASE_URL } from '@/lib/api';

interface StoreData {
  id: number;
  name: string;
  description?: string;
  status?: string;
  is_active?: boolean;
  product_count?: number;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  category?: string;
  price: number;
  total_quantity: number;
  reserved_quantity: number;
  image_url?: string;
  store: string;
  is_active: boolean;
}

const StoreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [store, setStore] = useState<StoreData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (id) {
      fetchStoreData();
      fetchStoreProducts();
    }
  }, [id]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, categoryFilter, sortBy]);

  const fetchStoreData = async () => {
    try {
      const response = await storeService.getStoreById(id!);
      setStore({
        ...response.data,
        is_active: response.data.status === 'APPROVED',
      } as StoreData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load store details',
        variant: 'destructive',
      });
    }
  };

  const fetchStoreProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products?store_id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.filter((p: Product) => p.is_active));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  if (loading && !store) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading store...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Store Not Found</h2>
            <p className="text-muted-foreground mb-4">This store doesn't exist or is not available.</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{store.name}</h1>
              {store.description && (
                <p className="text-muted-foreground">{store.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">
                  <Package className="h-3 w-3 mr-1" />
                  {store.product_count || 0} Products
                </Badge>
                {store.is_active && (
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat!}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {products.length === 0
                  ? 'This store has no products yet'
                  : 'No products match your search'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCardRectangular
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image_url,
                  total_quantity: product.total_quantity,
                  reserved_quantity: product.reserved_quantity,
                  store: product.store,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetail;
