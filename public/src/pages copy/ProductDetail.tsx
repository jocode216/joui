import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  Star,
  ShoppingCart,
  Package,
  Minus,
  Plus,
  Check,
  AlertCircle,
  Share2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import Footer from "@/components/layout/Footer";

const API_BASE_URL = "https://storemy.josephteka.com/api";

interface BackendProduct {
  id: number;
  name: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  price: number;
  total_quantity: number;
  reserved_quantity: number;
  image_url: string | null;
  store_name: string;
  store_id: number;
  is_active: boolean;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data: BackendProduct;
  error?: string;
  details?: Array<{ field: string; message: string }>;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, getItemQuantity } = useCart();
  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const cartQuantity = id ? getItemQuantity(Number(id)) : 0;

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/products/${id}`);

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch product");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch product");
      }

      // Ensure price is a number
      const productData = {
        ...data.data,
        price: Number(data.data.price) || 0,
      };

      setProduct(productData);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err instanceof Error ? err.message : "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const availableStock = product.total_quantity - product.reserved_quantity;

    if (availableStock <= 0) {
      toast({
        title: "Out of stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    if (quantity > availableStock) {
      toast({
        title: "Insufficient stock",
        description: `Only ${availableStock} items available`,
        variant: "destructive",
      });
      return;
    }

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || "/placeholder-image.jpg",
        stock: availableStock,
        store: product.store_name || `Store ${product.store_id}`,
      },
      quantity,
    );

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });

    setQuantity(1);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding py-8">
          <div className="container mx-auto max-w-6xl">
            <Skeleton className="h-6 w-32 mb-6" />

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <Skeleton className="aspect-square rounded-xl" />

              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-3/4" />
                </div>

                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>

                <Skeleton className="h-8 w-32" />

                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding py-8">
          <div className="container mx-auto max-w-4xl">
            <Link
              to="/products"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Link>

            <div className="text-center py-16">
              <AlertCircle className="h-16 w-16 text-destructive/60 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold mb-2">
                {error || "Product not found"}
              </h1>
              <p className="text-muted-foreground mb-6">
                {error
                  ? "There was an error loading the product"
                  : "The product you're looking for doesn't exist or has been removed."}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/products")}>
                  Browse Products
                </Button>
                {error && (
                  <Button variant="outline" onClick={fetchProduct}>
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const availableStock = product.total_quantity - product.reserved_quantity;
  const maxQuantity = Math.max(0, availableStock - cartQuantity);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="section-padding py-8">
        <div className="container mx-auto max-w-6xl">
          <Link
            to="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
           <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
  <img
    src={product.image_url || "/placeholder-image.jpg"}
    alt={product.name}
    className="w-full h-full object-contain"
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).src =
        "/placeholder-image.jpg";
    }}
  />
</div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {product.category && (
                  <>
                    <span className="capitalize">{product.category}</span>
                    <span>•</span>
                  </>
                )}
                {product.brand && <span>{product.brand}</span>}
              </div>

              <h1 className="text-2xl md:text-3xl font-semibold mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="ml-1 text-sm font-medium">4.5</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center text-sm">
                  <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span
                    className={`font-medium ${
                      availableStock > 10
                        ? "text-green-600"
                        : availableStock > 0
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {availableStock > 0
                      ? `${availableStock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Share
                </Button>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-semibold">
                  ETB{" "}
                  {typeof product.price === "number"
                    ? product.price.toFixed(2)
                    : "0.00"}
                </span>
              </div>

              {product.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="space-y-4 mt-auto">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium text-lg">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() =>
                        setQuantity(Math.min(maxQuantity, quantity + 1))
                      }
                      disabled={quantity >= maxQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {cartQuantity > 0 && (
                    <span className="text-sm text-muted-foreground">
                      ({cartQuantity} in cart)
                    </span>
                  )}
                </div>

                {/* Stock Information */}
                <div className="text-sm space-y-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Stock:</span>
                    <span>{product.total_quantity}</span>
                  </div>
                  {product.reserved_quantity > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reserved:</span>
                      <span className="text-amber-600">
                        {product.reserved_quantity}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available:</span>
                    <span
                      className={`font-medium ${
                        availableStock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {availableStock}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className={`flex-1 btn-brand ${cartQuantity > 0 ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={handleAddToCart}
                    disabled={availableStock === 0 || maxQuantity <= 0}
                  >
                    {cartQuantity > 0 ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Add More
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>

                {availableStock === 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">
                      This product is currently out of stock
                    </p>
                  </div>
                )}

                {maxQuantity > 0 && quantity > maxQuantity && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-600 text-center">
                      Only {maxQuantity} more items available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
