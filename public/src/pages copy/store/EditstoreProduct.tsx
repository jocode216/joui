import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  Save,
  Loader2,
  Package,
  DollarSign,
  Box,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  Store,
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
  status: string;
  description?: string;
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
  store_status?: string;
  store_owner_id?: number;
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
}

interface ApiResponse {
  success: boolean;
  data?: Product | Product[] | Store[];
  message?: string;
  error?: string;
  details?: Array<{ field: string; message: string }>;
}

const EditStoreProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [loadingStore, setLoadingStore] = useState<boolean>(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);

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
  });

  useEffect(() => {
    if (id) {
      fetchStoreOwnerStore();
    }
  }, [id]);

  // Fetch store owner's store
  const fetchStoreOwnerStore = async () => {
    try {
      setLoadingStore(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      // Get user ID from token or localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User information not found");
      }

      // Fetch store owned by this user
      const response = await fetch(`${API_BASE_URL}/stores/owner/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.success) {
        const stores = data.data as Store[] || [];

        if (stores.length === 0) {
          toast({
            title: "No Store Found",
            description: "You don't have a store yet. Please create a store first.",
            variant: "destructive",
          });
          navigate("/store");
          return;
        }

        // Get the first store (store owners typically have one store)
        const store = stores[0];
        setCurrentStore(store);
        setStoreId(store.id);

        // Check if store is approved
        if (store.status !== "APPROVED") {
          toast({
            title: "Store Not Approved",
            description: `Your store is currently ${store.status.toLowerCase()}. You can only edit products in approved stores.`,
            variant: "destructive",
          });
          setCanEdit(false);
        } else {
          setCanEdit(true);
        }

        // Now fetch the product
        await fetchProduct(store.id);
      } else {
        throw new Error(data.error || "Failed to fetch your store information");
      }
    } catch (error) {
      const err = error as Error;
      console.error("Error fetching store:", err);
      toast({
        title: "Error",
        description: `Failed to load store information: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingStore(false);
    }
  };

  const fetchProduct = async (ownerStoreId: number) => {
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

      const productData = data.data as Product;
      
      // Check if the product belongs to the store owner's store
      if (productData.store_id !== ownerStoreId) {
        toast({
          title: "Access Denied",
          description: "You can only edit products from your own store.",
          variant: "destructive",
        });
        navigate("/store/products");
        return;
      }

      // Check if store is approved
      if (productData.store_status !== "APPROVED") {
        toast({
          title: "Store Not Approved",
          description: "You can only edit products in approved stores.",
          variant: "destructive",
        });
        setCanEdit(false);
      }

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
        is_active: productData.is_active !== undefined ? productData.is_active : true,
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error fetching product:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load product",
        variant: "destructive",
      });
      navigate("/store/products");
    } finally {
      setLoading(false);
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_active: checked,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push("Product name is required");
    if (!formData.price || parseFloat(formData.price) <= 0)
      errors.push("Valid price is required (must be greater than 0)");
    if (!formData.total_quantity || parseInt(formData.total_quantity) < 0)
      errors.push("Valid stock quantity is required (must be 0 or greater)");

    const totalQty = parseInt(formData.total_quantity) || 0;
    const reservedQty = parseInt(formData.reserved_quantity) || 0;
    if (reservedQty > totalQty) {
      errors.push("Reserved quantity cannot exceed total quantity");
    }

    if (formData.price && parseFloat(formData.price) > 9999999.99) {
      errors.push("Price is too high. Maximum is 9,999,999.99");
    }

    return errors;
  };

  const handleUpdateProduct = async () => {
    // Check if store is approved
    if (!canEdit || !currentStore || currentStore.status !== "APPROVED") {
      toast({
        title: "Store Not Approved",
        description: "You can only edit products in approved stores.",
        variant: "destructive",
      });
      return;
    }

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    if (!storeId || !product) {
      toast({
        title: "Error",
        description: "Store information is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (!token || !id) {
        throw new Error("Authentication required. Please log in.");
      }

      // Prepare update data
      const updateData: Record<string, any> = {
        store_id: storeId, // Always include store_id to ensure it belongs to owner's store
      };

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

      // If no fields changed (except store_id which is always included)
      const changedFields = Object.keys(updateData).filter(key => key !== 'store_id');
      if (changedFields.length === 0) {
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
      await fetchProduct(storeId);

      toast({
        title: "Success! 🎉",
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

  if (loading || loadingStore) {
    return (
      <AdminLayout isStoreOwner>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (!product || !currentStore) {
    return (
      <AdminLayout isStoreOwner>
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or you don't have permission to access it.
          </p>
          <Button onClick={() => navigate("/store/products")}>
            Back to My Products
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const availableStock =
    product.total_quantity - (product.reserved_quantity || 0);

  return (
    <AdminLayout isStoreOwner>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/store/products")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to My Products
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                Edit Product
              </h1>
              <p className="text-muted-foreground mt-1">
                Product ID: {product.id} • Store: {currentStore.name}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="btn-brand"
              onClick={handleUpdateProduct}
              disabled={saving || !canEdit}
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

        {/* Store Info Card */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-blue-900">
                  {currentStore.name}
                </h3>
                <p className="text-sm text-blue-700">
                  {currentStore.description || "Your store"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentStore.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : currentStore.status === "PENDING"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                }`}>
                  {currentStore.status}
                </span>
                {!canEdit && (
                  <p className="text-xs text-red-600">
                    Cannot edit - Store not approved
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {canEdit ? (
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
                    <Label htmlFor="name">
                      Product Name <span className="text-destructive">*</span>
                    </Label>
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
                        onValueChange={handleCategoryChange}
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
                      <Label htmlFor="price">
                        Price (ETB) <span className="text-destructive">*</span>
                      </Label>
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
                      <Label htmlFor="total_quantity">
                        Total Stock <span className="text-destructive">*</span>
                      </Label>
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
              {/* Product Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  {/* Store Owner Note */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                    <p className="text-sm font-medium text-slate-800 mb-1">
                      Store Owner Note:
                    </p>
                    <p className="text-xs text-slate-600">
                      This product belongs to your store:{" "}
                      <strong>{currentStore.name}</strong>
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Store ID:{" "}
                      <code className="bg-slate-100 px-1 rounded">
                        {storeId}
                      </code>
                    </p>
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
                      {currentStore.name}
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
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Store Not Approved</h3>
                <p className="text-muted-foreground mb-6">
                  Your store is currently {currentStore.status.toLowerCase()}. 
                  You can only edit products when your store is approved by an administrator.
                </p>
                <Button onClick={() => navigate("/store")}>
                  Go to Store Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditStoreProduct;