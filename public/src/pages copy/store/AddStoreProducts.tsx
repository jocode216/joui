import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Loader2,
  Package,
  Box,
  Image as ImageIcon,
  Upload,
  X,
  PlusCircle,
} from "lucide-react";

const IMGBB_API_KEY = "facc0f6ee6ae643cf6be34c52925b8dc"; // Your ImgBB API key

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
  message?: string;
  error?: string;
  details?: Array<{ field: string; message: string }>;
  data?: any;
}

const AddStoreProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState<boolean>(false);
  const [loadingStore, setLoadingStore] = useState<boolean>(true);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    total_quantity: "",
    reserved_quantity: "0",
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    fetchStoreOwnerStore();
  }, []);

  // Fetch store owner's store
  const fetchStoreOwnerStore = async () => {
    try {
      setLoadingStore(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required. Please log in.",
          variant: "destructive",
        });
        navigate("/login");
        return;
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
        const stores = data.data || [];

        if (stores.length === 0) {
          toast({
            title: "No Store Found",
            description:
              "You don't have a store yet. Please create a store first.",
            variant: "destructive",
          });
          navigate("/store");
          return;
        }

        // Get the first store (store owners typically have one store)
        const store = stores[0];

        // Check if store is approved
        if (store.status !== "APPROVED") {
          toast({
            title: "Store Not Approved",
            description: `Your store is currently ${store.status.toLowerCase()}. You can only add products to approved stores.`,
            variant: "destructive",
          });
          setCurrentStore(store);
          setStoreId(store.id);
        } else {
          setCurrentStore(store);
          setStoreId(store.id);
        }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (ImgBB limit is 32MB)
    if (file.size > 32 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 32MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToImgBB = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      
      // Convert file to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          // Remove the data:image/*;base64, prefix
          const base64 = reader.result?.toString().split(',')[1];
          if (base64) resolve(base64);
          else reject(new Error('Failed to convert image to base64'));
        };
        reader.onerror = reject;
      });

      // Create FormData for the upload
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', base64Image);
      
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Return the direct image URL
        return result.data.url || result.data.display_url;
      } else {
        throw new Error(result.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    const imageUrl = await uploadImageToImgBB(selectedFile);
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl
      }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image_url: ""
    }));
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

    if (!storeId) errors.push("Store information is missing");

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

  const handleAddProduct = async () => {
    // Check if store is approved
    if (currentStore && currentStore.status !== "APPROVED") {
      toast({
        title: "Store Not Approved",
        description: `Your store is currently ${currentStore.status.toLowerCase()}. You can only add products to approved stores.`,
        variant: "destructive",
      });
      return;
    }

    // Upload image first if selected but not yet uploaded
    if (selectedFile && !formData.image_url) {
      toast({
        title: "Image not uploaded",
        description: "Please upload the selected image first",
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

    if (!storeId) {
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

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        brand: formData.brand.trim() || null,
        category: formData.category.trim() || null,
        price: parseFloat(formData.price),
        total_quantity: parseInt(formData.total_quantity),
        reserved_quantity: parseInt(formData.reserved_quantity) || 0,
        image_url: formData.image_url.trim() || null,
        is_active: formData.is_active,
        store_id: storeId, // Automatically set to store owner's store
      };
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        console.error("Server response:", data);
        if (response.status === 400 && data.details) {
          const errorMessages = data.details
            .map((detail) => detail.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(
          data.error || `Failed to add product: ${response.status}`,
        );
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to add product");
      }

      toast({
        title: "Success! 🎉",
        description: data.message || "Product added successfully to your store",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        brand: "",
        category: "",
        price: "",
        total_quantity: "",
        reserved_quantity: "0",
        image_url: "",
        is_active: true,
      });
      setSelectedFile(null);
      setImagePreview(null);

      // Navigate to store products list
      setTimeout(() => {
        navigate("/store/products");
      }, 1500);
    } catch (error) {
      const err = error as Error;
      console.error("Error adding product:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to add product",
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

  const canAddProduct =
    !loadingStore && storeId && currentStore?.status === "APPROVED";

  return (
    <AdminLayout isStoreOwner>
      {" "}
      {/* FIXED: Added isStoreOwner prop */}
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
                Add New Product
              </h1>
              <p className="text-muted-foreground mt-1">
                Add a new product to your store catalog
              </p>
            </div>
          </div>
          <Button
            className="btn-brand"
            onClick={handleAddProduct}
            disabled={saving || !canAddProduct}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving..." : "Add Product"}
          </Button>
        </div>

        {/* Store Info Card */}
        {currentStore && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Store: {currentStore.name}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {currentStore.description || "Your store"}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      currentStore.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : currentStore.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentStore.status}
                  </span>
                  {currentStore.status !== "APPROVED" && (
                    <p className="text-xs text-red-600 mt-1">
                      Only approved stores can add products
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loadingStore ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                Loading store information...
              </p>
            </div>
          </div>
        ) : !currentStore ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-4">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Store Found</h3>
            <p className="text-muted-foreground mb-4">
              You need to create a store first before adding products.
            </p>
            <Button onClick={() => navigate("/store/create")}>
              Create a Store
            </Button>
          </div>
        ) : (
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
                      disabled={currentStore.status !== "APPROVED"}
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
                      disabled={currentStore.status !== "APPROVED"}
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
                        disabled={currentStore.status !== "APPROVED"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                        disabled={currentStore.status !== "APPROVED"}
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
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">ETB</span>
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
                          className="pl-12"
                          disabled={currentStore.status !== "APPROVED"}
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
                          disabled={currentStore.status !== "APPROVED"}
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
                          disabled={currentStore.status !== "APPROVED"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Product Image</Label>
                    
                    <div className="space-y-3">
                      {/* File Input */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                            disabled={currentStore.status !== "APPROVED"}
                          />
                        </div>
                        {selectedFile && (
                          <Button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={uploadingImage || !!formData.image_url}
                            variant="outline"
                          >
                            {uploadingImage ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            {uploadingImage ? "Uploading..." : "Upload Image"}
                          </Button>
                        )}
                      </div>

                      {/* Preview and URL Display */}
                      {imagePreview && (
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Preview</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeImage}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-32 w-32 rounded-md object-cover border"
                            />
                            
                            <div className="flex-1 space-y-2">
                              {selectedFile && (
                                <p className="text-sm text-muted-foreground">
                                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                </p>
                              )}
                              
                              {formData.image_url && (
                                <div className="space-y-1">
                                  <Label className="text-sm font-medium">Uploaded Image URL:</Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={formData.image_url}
                                      readOnly
                                      className="text-xs"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        navigator.clipboard.writeText(formData.image_url);
                                        toast({
                                          title: "Copied!",
                                          description: "Image URL copied to clipboard",
                                        });
                                      }}
                                    >
                                      Copy
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Or use URL directly */}
                      <div className="space-y-2">
                        <Label htmlFor="image_url">Or enter image URL directly:</Label>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="image_url"
                            name="image_url"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            className="pl-10"
                            disabled={currentStore.status !== "APPROVED"}
                          />
                        </div>
                      </div>
                    </div>
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
                        Active products are visible to customers
                      </p>
                    </div>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={handleSwitchChange}
                      disabled={saving || currentStore.status !== "APPROVED"}
                    />
                  </div>

                  {/* Store Owner Note */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                    <p className="text-sm font-medium text-slate-800 mb-1">
                      Store Owner Note:
                    </p>
                    <p className="text-xs text-slate-600">
                      Products are automatically added to your store:{" "}
                      <strong>{currentStore.name}</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Store Status Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Store Status Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 mt-1"></div>
                    <div>
                      <p className="font-medium">APPROVED ✓</p>
                      <p className="text-muted-foreground">
                        You can add products
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500 mt-1"></div>
                    <div>
                      <p className="font-medium">PENDING ⏳</p>
                      <p className="text-muted-foreground">
                        Waiting for admin approval
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500 mt-1"></div>
                    <div>
                      <p className="font-medium">REJECTED ✗</p>
                      <p className="text-muted-foreground">
                        Cannot add products
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500 mt-1"></div>
                    <div>
                      <p className="font-medium">SUSPENDED ⚠️</p>
                      <p className="text-muted-foreground">
                        Cannot add products
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AddStoreProducts;
