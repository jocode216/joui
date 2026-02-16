import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroCarouselEffect from "@/components/HeroCarouselEffect";
import ProductCardStyled from "@/components/ProductCardStyled";
import styles from "@/components/ProductGrid.module.css";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "https://storemy.josephteka.com/api";

interface BackendProduct {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  category?: string;
  price: number;
  total_quantity: number;
  reserved_quantity: number;
  image_url?: string;
  store_name?: string;
  store_id?: number;
  is_active?: boolean;
  created_at?: string;
}

interface ApiResponse {
  success: boolean;
  data: BackendProduct[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
}

const Index = () => {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  const fetchProducts = async (page = 1, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setIsLoading(true);
      }
      setError(null);

      const url = `${API_BASE_URL}/products?page=${page}&limit=${pagination.limit}`;

      const response = await fetch(url);
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch products");
      }

      const filteredProducts = data.data.filter(
        (product) => product.is_active !== false,
      );

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...filteredProducts]);
      } else {
        setProducts(filteredProducts);
      }

      if (data.pagination) {
        setPagination((prev) => ({
          ...prev,
          page,
          total: data.pagination!.total,
          totalPages: data.pagination!.totalPages,
        }));
        setHasMore(page < data.pagination!.totalPages);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, false);
  }, []);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchProducts(pagination.page + 1, true);
    }
  };

  const transformProductData = (products: BackendProduct[]) => {
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      title: product.name,
      price: Number(product.price) || 0,
      thumbnail: product.image_url || "/placeholder-image.jpg",
      image_url: product.image_url || "/placeholder-image.jpg",
      category: product.category || "uncategorized",
      description: product.description || "",
      total_quantity: product.total_quantity,
      reserved_quantity: product.reserved_quantity,
      store: product.store_name || `Store ${product.store_id}`,
    }));
  };

  const transformedProducts = transformProductData(products);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Carousel - Professional like example folder */}
      <HeroCarouselEffect />

      {/* For You Section with Curved Background */}
      <section className="relative py-12 md:py-16">
        {/* Curved beige background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "hsl(var(--primary) / 0.3)",
            borderRadius: "50% 50% 0 0 / 30px 30px 0 0",
            marginTop: "40px",
          }}
        />

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              For You
            </h2>
            <Link to="/products">
              <Button variant="ghost" className="text-sm font-medium">
                View All
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products available</p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {transformedProducts.slice(0, 12).map((product) => (
                <ProductCardStyled key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

         {products.length > 0 && (
           <div className="mt-12 flex justify-center">
             <Link to="/products">
               <Button
                 className="group relative h-12 px-10 overflow-hidden rounded-md bg-transparent p-[2px] hover:opacity-90"
               >
                 {/* The Animated Border Spinner */}
                 <div 
                   className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#E2E8F0_50%,#FACC15_100%)]" 
                 />

                 {/* The Button Content Container */}
                 <span className="relative z-10 flex h-full w-full items-center justify-center rounded-md bg-[#ccc] px-10 py-2 text-black transition-colors group-hover:bg-[#bbb]">
                   Load More
                 </span>
               </Button>
             </Link>
           </div>
         )}

      </section>


      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
