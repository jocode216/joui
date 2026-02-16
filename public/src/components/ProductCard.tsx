import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Package, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    id: number;
    title?: string;
    name?: string;
    description?: string;
    category?: string;
    price: number;
    thumbnail?: string;
    image_url?: string;
    total_quantity?: number;
    reserved_quantity?: number;
    store?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, getItemQuantity } = useCart();
  const { toast } = useToast();
  
  const productName = product.title || product.name || 'Unnamed Product';
  const productImage = product.thumbnail || product.image_url || '/placeholder-image.jpg';
  const totalStock = product.total_quantity || 100;
  const reservedStock = product.reserved_quantity || 0;
  const availableStock = totalStock - reservedStock;
  const isInCart = getItemQuantity(product.id) > 0;
  const cartQuantity = getItemQuantity(product.id);

  // Stock status
  const getStockStatus = () => {
    if (availableStock <= 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    } else if (availableStock <= 10) {
      return { text: `Low Stock (${availableStock})`, color: 'text-amber-600', bg: 'bg-amber-100' };
    } else {
      return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
    }
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (availableStock <= 0) {
      toast({
        title: 'Out of Stock',
        description: `${productName} is currently out of stock`,
        variant: 'destructive',
      });
      return;
    }

    // Check if adding more than available stock
    if (cartQuantity >= availableStock) {
      toast({
        title: 'Stock Limit',
        description: `Only ${availableStock} items available`,
        variant: 'destructive',
      });
      return;
    }
    
    addToCart({
      id: product.id,
      name: productName,
      price: product.price,
      image_url: productImage,
      stock: availableStock,
      store: product.store,
    });

    toast({
      title: 'Added to cart',
      description: `${productName} has been added to your cart`,
    });
  };

  return (
    <div className="group card-minimal overflow-hidden transition-shadow hover:shadow-md relative">
      {/* Stock Badge */}
      {availableStock <= 10 && (
        <div className="absolute top-2 left-2 z-10">
          <Badge
            variant="secondary"
            className={`${stockStatus.bg} ${stockStatus.color} font-medium border-0`}
          >
            {availableStock <= 0 ? (
              <AlertCircle className="h-3 w-3 mr-1" />
            ) : (
              <Package className="h-3 w-3 mr-1" />
            )}
            {stockStatus.text}
          </Badge>
        </div>
      )}

      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-secondary relative">
          <img
            src={productImage}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
            }}
          />
          {/* Overlay for out of stock */}
          {availableStock <= 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-medium text-sm px-3 py-1 bg-black/70 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground line-clamp-1 hover:underline">
            {productName}
          </h3>
        </Link>
        <p className="mt-2 text-lg font-semibold text-foreground">
          ETB{" "}
          {typeof product.price === "number"
            ? product.price.toFixed(2)
            : "0.00"}
        </p>
        <Button
          className={`mt-3 w-full ${
            isInCart
              ? "bg-green-600 hover:bg-green-700"
              : availableStock <= 0
                ? "bg-muted hover:bg-muted cursor-not-allowed"
                : "btn-brand"
          }`}
          size="sm"
          onClick={handleAddToCart}
          disabled={availableStock <= 0}
        >
          {availableStock <= 0 ? (
            <>
              <AlertCircle className="h-4 w-4 mr-2" />
              Out of Stock
            </>
          ) : isInCart ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              {cartQuantity} in Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;