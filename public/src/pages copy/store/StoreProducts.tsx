import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Pencil, Trash2, Plus, Loader2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://storemy.josephteka.com/api";

// Type definitions
interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  category?: string;
  price: number | string;
  total_quantity: number;
  reserved_quantity: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
  message?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const StoreProducts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Fetch store owner's products
  useEffect(() => {
    fetchStoreProducts();
  }, [pagination.page]);

  const fetchStoreProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(
        `${API_BASE_URL}/products/owner/mine?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch products");
      }

      setProducts(data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 1,
      }));
    } catch (error) {
      const err = error as Error;
      console.error("Error fetching store products:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load your products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(
        `${API_BASE_URL}/products/${selectedProduct.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete product");
      }

      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      fetchStoreProducts();

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = () => {
    navigate("/store/products/add");
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/store/products/edit/${productId}`);
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower)
    );
  });

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/placeholder-image.jpg";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AdminLayout isStoreOwner>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">My Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product catalog ({pagination.total} products)
            </p>
          </div>

          <Button className="btn-brand" onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, description or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Table */}
        <div className="card-minimal overflow-hidden border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="table-header w-[300px]">
                  Product
                </TableHead>
                <TableHead className="table-header">Category</TableHead>
                <TableHead className="table-header">Price</TableHead>
                <TableHead className="table-header">Stock</TableHead>
                <TableHead className="table-header">Added Date</TableHead>
                {/* Status Header Removed */}
                <TableHead className="table-header text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 mb-4 animate-spin text-primary" />
                      <p>Loading products...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-muted/50 p-4 rounded-full mb-3">
                        <Package className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="font-medium">
                        {searchQuery
                          ? "No products found matching your search"
                          : "No products found"}
                      </p>
                      {!searchQuery && (
                        <Button
                          variant="link"
                          onClick={handleAddProduct}
                          className="mt-2"
                        >
                          Create your first product
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const availableStock =
                    product.total_quantity - (product.reserved_quantity || 0);
                  const price =
                    typeof product.price === "string"
                      ? parseFloat(product.price)
                      : product.price;

                  return (
                    <TableRow key={product.id}>
                      <TableCell className="table-cell">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover border"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center border">
                              <Package className="h-5 w-5 text-muted-foreground/50" />
                            </div>
                          )}
                          <div>
                            <span className="font-medium line-clamp-1">
                              {product.name}
                            </span>
                            {product.brand && (
                              <p className="text-xs text-muted-foreground">
                                {product.brand}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell text-muted-foreground capitalize">
                        {product.category || "Uncategorized"}
                      </TableCell>
                      <TableCell className="table-cell font-medium">
                        ETB {price.toFixed(2)}
                      </TableCell>
                      <TableCell className="table-cell">
                        <div className="flex flex-col">
                          <span className="text-sm">
                            Total: {product.total_quantity}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Avail: {availableStock}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell text-sm text-muted-foreground">
                        {formatDate(product.created_at)}
                      </TableCell>

                      {/* Status Cell Removed */}

                      <TableCell className="table-cell text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent className="bg-background">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedProduct?.name}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProduct}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default StoreProducts;
