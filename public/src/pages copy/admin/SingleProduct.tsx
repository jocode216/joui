import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  Save,
  Loader2,
  Package,
  DollarSign,
  Box,
  Tag,
  Store,
  Image as ImageIcon,
  Eye,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "https://storemy.josephteka.com/api";

const PRODUCT_CATEGORIES = [
  "electronics",
  "womens",
  "mens",
  "kids",
  "beauty",
  "decoration",
  "digital",
];

// Type definitions
interface Store {
  id: number;
  name: string;
  is_active: boolean;
}

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
  store_id: number;
  store_name?: string;
  created_at: string;
}

interface FormData {
  name: string;
  description: string;
  brand: string;
  category: string;
  price: string;
  total_quantity: string;
  reserved_quantity: string;
  image_url: string;
  is_active: boolean;
  store_id: string;
}

interface ApiResponse {
  success: boolean;
  data?: Product;
  message?: string;
  error?: string;
  details?: Array<{ field: string; message: string }>;
}

const SingleProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    total_quantity: "",
    reserved_quantity: "",
    image_url: "",
    is_active: true,
    store_id: "",
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchStores();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch product");
      }

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch product");
      }

      const productData = data.data;
      setProduct(productData);

      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        brand: productData.brand || "",
        category: productData.category || "",
        price: productData.price.toString() || "",
        total_quantity: productData.total_quantity.toString() || "",
        reserved_quantity: productData.reserved_quantity.toString() || "",
        image_url: productData.image_url || "",
        is_active:
          productData.is_active !== undefined ? productData.is_active : true,
        store_id: productData.store_id?.toString() || "",
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error fetching product:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load product",
        variant: "destructive",
      });
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const response = await fetch(`${API_BASE_URL}/stores?limit=100`, {
        headers,
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStores(data.data.filter((store: Store) => store.is_active) || []);
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_active: checked,
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push("Product name is required");
    if (!formData.price || parseFloat(formData.price) <= 0)
      errors.push("Valid price is required");
    if (!formData.total_quantity || parseInt(formData.total_quantity) < 0)
      errors.push("Valid stock quantity is required");
    if (!formData.store_id) errors.push("Store selection is required");

    const totalQty = parseInt(formData.total_quantity) || 0;
    const reservedQty = parseInt(formData.reserved_quantity) || 0;
    if (reservedQty > totalQty) {
      errors.push("Reserved quantity cannot exceed total quantity");
    }

    return errors;
  };

  const handleUpdateProduct = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (!token || !id || !product) {
        throw new Error("Authentication required. Please log in.");
      }

      // Prepare update data
      const updateData: Record<string, any> = {};

      // Only include fields that have changed
      if (formData.name !== product.name) updateData.name = formData.name;
      if (formData.description !== product.description)
        updateData.description = formData.description || null;
      if (formData.brand !== product.brand)
        updateData.brand = formData.brand || null;
      if (formData.category !== product.category)
        updateData.category = formData.category || null;
      if (parseFloat(formData.price) !== parseFloat(product.price.toString()))
        updateData.price = parseFloat(formData.price);
      if (
        parseInt(formData.total_quantity) !==
        parseInt(product.total_quantity.toString())
      )
        updateData.total_quantity = parseInt(formData.total_quantity);
      if (
        parseInt(formData.reserved_quantity) !==
        parseInt(product.reserved_quantity.toString())
      )
        updateData.reserved_quantity =
          parseInt(formData.reserved_quantity) || 0;
      if (formData.image_url !== product.image_url)
        updateData.image_url = formData.image_url || null;
      if (formData.is_active !== product.is_active)
        updateData.is_active = formData.is_active;
      if (parseInt(formData.store_id) !== product.store_id)
        updateData.store_id = parseInt(formData.store_id);

      // If no fields changed
      if (Object.keys(updateData).length === 0) {
        toast({
          title: "Info",
          description: "No changes detected",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.details) {
          const errorMessages = data.details
            .map((detail) => detail.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.error || "Failed to update product");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to update product");
      }

      // Update local state
      await fetchProduct();

      toast({
        title: "Success",
        description: data.message || "Product updated successfully",
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error updating product:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/placeholder-image.jpg";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/admin/products")}>
            Back to Products
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const availableStock =
    product.total_quantity - (product.reserved_quantity || 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/products")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                Edit Product
              </h1>
              <p className="text-muted-foreground mt-1">
                Product ID: {product.id}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/product/${product.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            <Button
              className="btn-brand"
              onClick={handleUpdateProduct}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      placeholder="Brand name"
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ETB) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_quantity">Total Stock *</Label>
                    <div className="relative">
                      <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="total_quantity"
                        name="total_quantity"
                        type="number"
                        placeholder="0"
                        value={formData.total_quantity}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reserved_quantity">Reserved Stock</Label>
                    <div className="relative">
                      <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reserved_quantity"
                        name="reserved_quantity"
                        type="number"
                        placeholder="0"
                        value={formData.reserved_quantity}
                        onChange={handleInputChange}
                        min="0"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="image_url"
                      name="image_url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url}
                        alt="Product preview"
                        className="h-32 w-32 rounded-md object-cover border border-border"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Store & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="store_id">Store *</Label>
                  <Select
                    value={formData.store_id}
                    onValueChange={(value) =>
                      handleSelectChange("store_id", value)
                    }
                    disabled={saving}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_active">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.is_active
                        ? "Product is active and visible"
                        : "Product is inactive and hidden"}
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange}
                    disabled={saving}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Stock Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Stock Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Stock</span>
                  <span className="font-medium">{product.total_quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Currently Reserved
                  </span>
                  <span className="font-medium text-amber-600">
                    {product.reserved_quantity || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span
                    className={`font-medium ${
                      availableStock > 10
                        ? "text-green-600"
                        : availableStock > 0
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {availableStock}
                  </span>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Reserved items are those in pending orders
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product ID</span>
                  <span className="font-medium">#{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Store</span>
                  <span className="font-medium">
                    {product.store_name || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Price</span>
                  <span className="font-medium">
                    ETB {parseFloat(product.price.toString()).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SingleProduct;
