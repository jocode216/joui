import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Package, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardRectangularProps {
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

const ProductCardRectangular = ({ product }: ProductCardRectangularProps) => {
  const { addToCart, getItemQuantity } = useCart();
  const { toast } = useToast();
  
  const productName = product.title || product.name || 'Unnamed Product';
  const productImage = product.thumbnail || product.image_url || '/placeholder-image.jpg';
  const totalStock = product.total_quantity || 100;
  const reservedStock = product.reserved_quantity || 0;
  const availableStock = totalStock - reservedStock;
  const isInCart = getItemQuantity(product.id) > 0;
  const cartQuantity = getItemQuantity(product.id);

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
    <div className="group bg-background border border-border overflow-hidden transition-shadow hover:shadow-md relative">
      {/* Out of Stock Overlay */}
      {availableStock <= 0 && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1">
            Out of Stock
          </span>
        </div>
      )}

      {/* Low Stock Badge */}
      {availableStock > 0 && availableStock <= 10 && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1">
            Only {availableStock} left
          </span>
        </div>
      )}

      {/* Quick Add Button */}
      <button
        onClick={handleAddToCart}
        disabled={availableStock <= 0}
        className={`absolute top-2 right-2 z-10 p-2 transition-all opacity-0 group-hover:opacity-100 ${
          availableStock <= 0 
            ? 'bg-muted cursor-not-allowed' 
            : isInCart 
              ? 'bg-green-600 text-white' 
              : 'bg-background border border-border hover:bg-primary hover:text-primary-foreground'
        }`}
      >
        {isInCart ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </button>

      <Link to={`/product/${product.id}`}>
        {/* Image - Rectangular aspect ratio */}
        <div className="aspect-[3/4] overflow-hidden bg-secondary relative">
          <img
            src={productImage}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
            }}
          />
          {/* Out of stock overlay */}
          {availableStock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium text-sm px-3 py-1 bg-black/70">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:underline leading-tight min-h-[40px]">
            {productName}
          </h3>
        </Link>
        
        {/* Price Row */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-foreground">
            ETB {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
          </span>
        </div>

        {/* Store & Cart Info */}
        <div className="flex items-center justify-between mt-2">
          {product.store && (
            <span className="text-xs text-muted-foreground truncate max-w-[70%]">
              {product.store}
            </span>
          )}
          {cartQuantity > 0 && (
            <span className="text-xs font-medium text-primary">
              {cartQuantity} in cart
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCardRectangular;
