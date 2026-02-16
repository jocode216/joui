import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, AlertCircle, Package, Loader2 } from "lucide-react";
import { debounce } from "lodash";

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
  details?: Array<{ field: string; message: string }>;
}

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category");
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12, // Load 10 at a time
    total: 0,
    totalPages: 1,
  });

  const transformProductData = useCallback((products: BackendProduct[]) => {
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      title: product.name,
      price: Number(product.price) || 0, // Ensure price is a number
      thumbnail: product.image_url || "/placeholder-image.jpg",
      image_url: product.image_url || "/placeholder-image.jpg",
      category: product.category || "uncategorized",
      description: product.description || "",
      total_quantity: product.total_quantity,
      reserved_quantity: product.reserved_quantity,
      store: product.store_name || `Store ${product.store_id}`,
    }));
  }, []);

  const fetchProducts = useCallback(
    async (page = 1, isLoadMore = false) => {
      try {
        setLoading(true);
        if (!isLoadMore) {
          setInitialLoading(true);
        }
        setError(null);

        let url = `${API_BASE_URL}/products?page=${page}&limit=${pagination.limit}`;

        // Add search query if exists
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        // If category is specified, use the category endpoint
        if (category) {
          url = `${API_BASE_URL}/products/category/${category}?page=${page}&limit=${pagination.limit}`;
          if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`;
          }
        }

        const response = await fetch(url);

        const data: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch products");
        }

        // Filter only active products on frontend if needed
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
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [category, searchQuery, pagination.limit],
  );

  // Initial load
  useEffect(() => {
    setProducts([]);
    fetchProducts(1, false);
  }, [category, searchQuery]);

  // Load more products
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(pagination.page + 1, true);
    }
  };

  // Handle search with debounce
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setProducts([]);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    debouncedSearch(query);
  };

  const transformedProducts = transformProductData(products);

  // Fix for ProductCard - ensure price is a number
  const ProductCardWithPriceFix = ({ product }: any) => {
    // Ensure price is a number
    const fixedProduct = {
      ...product,
      price: Number(product.price) || 0,
    };

    return <ProductCard product={fixedProduct} />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="section-padding py-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">
                  {category
                    ? category
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "All Products"}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {pagination.total} products available
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-96">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-9"
                    onChange={handleSearchChange}
                    defaultValue={searchQuery}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">Error loading products</p>
                    <p className="text-sm mt-1">{error}</p>
                    <Button
                      onClick={() => fetchProducts(1, false)}
                      size="sm"
                      variant="outline"
                      className="mt-3"
                    >
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Try again
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {initialLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-minimal overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : transformedProducts.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
              <div className="text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg font-medium mb-2">
                  {searchQuery
                    ? `No products found for "${searchQuery}"`
                    : "No products found"}
                </p>
                <p className="text-sm mb-4">
                  {category
                    ? `Try searching for something else or browse all products`
                    : "Try adjusting your search or filters"}
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      const input = document.querySelector(
                        'input[type="search"]',
                      ) as HTMLInputElement;
                      if (input) input.value = "";
                    }}
                    variant="outline"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {transformedProducts.map((product) => (
                  <ProductCardWithPriceFix key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={loadMore}
                    disabled={loading}
                    className="min-w-[200px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Products"
                    )}
                  </Button>
                </div>
              )}

              {/* Show loaded count */}
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Showing {products.length} of {pagination.total} products
                {hasMore && " • Scroll up to load more"}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;
