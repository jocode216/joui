import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Search, Pencil, Trash2, Eye, Plus, Loader2 } from "lucide-react";
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
  store_name?: string;
  store_id?: number;
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

const AdminProducts = () => {
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

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(
        `${API_BASE_URL}/products?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products");
      }

      if (!data.success) {
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
      console.error("Error fetching products:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load products",
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

      if (!token) {
        throw new Error("Authentication required");
      }

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

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to delete product");
      }

      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();

      toast({
        title: "Success",
        description: data.message || "Product deactivated successfully",
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error deleting product:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      (product.description &&
        product.description.toLowerCase().includes(searchLower)) ||
      (product.category &&
        product.category.toLowerCase().includes(searchLower)) ||
      (product.brand && product.brand.toLowerCase().includes(searchLower));
    return matchesSearch;
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/placeholder-image.jpg";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product catalog ({pagination.total} products)
            </p>
          </div>

          <Button
            className="btn-brand"
            onClick={() => navigate("/admin/addproducts")}
          >
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
        <div className="card-minimal overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="table-header">Product</TableHead>
                <TableHead className="table-header">Category</TableHead>
                <TableHead className="table-header">Store</TableHead>
                <TableHead className="table-header">Price</TableHead>
                <TableHead className="table-header">Stock</TableHead>
                <TableHead className="table-header">Status</TableHead>
                <TableHead className="table-header text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading products...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchQuery
                      ? "No products found matching your search"
                      : "No products found"}
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
                              className="h-10 w-10 rounded-md object-cover"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                No Image
                              </span>
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
                      <TableCell className="table-cell text-muted-foreground capitalize">
                        {product.store_name || "No store"}
                      </TableCell>
                      <TableCell className="table-cell font-medium">
                        ETB {price.toFixed(2)}
                      </TableCell>
                      <TableCell className="table-cell">
                        <div className="flex flex-col">
                          <span>Total: {product.total_quantity}</span>
                          <span className="text-xs text-muted-foreground">
                            Available: {availableStock}
                          </span>
                          {product.reserved_quantity > 0 && (
                            <span className="text-xs text-amber-600">
                              Reserved: {product.reserved_quantity}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="table-cell text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/product/${product.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
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
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will deactivate the product "{selectedProduct?.name}". The
                product will be hidden from customers but can be reactivated
                later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProduct}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Deactivate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
