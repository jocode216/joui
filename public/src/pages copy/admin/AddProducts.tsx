import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Loader2,
  Package,
  DollarSign,
  Box,
  Tag,
  Store,
  Image as ImageIcon,
  Upload,
  X,
  PlusCircle,
  RefreshCw,
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
  owner_first_name?: string;
  owner_last_name?: string;
  owner_phone?: string;
  product_count?: number;
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
  message?: string;
  error?: string;
  details?: Array<{ field: string; message: string }>;
  data?: any;
}

const AddProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState<boolean>(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState<boolean>(true);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

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
    store_id: "",
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoadingStores(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required. Please log in.",
          variant: "destructive",
        });
        return;
      }

      // Try without query parameters first
      const response = await fetch(`${API_BASE_URL}/stores`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data: ApiResponse = await response.json();
      if (response.ok && data.success) {
        const storesData = data.data || [];
        // Show all stores for admin
        setStores(storesData);
        
        if (storesData.length === 0) {
          toast({
            title: "Info",
            description: "No stores found. Please create a store first.",
            variant: "default",
          });
        }
      } else {
        throw new Error(data.error || "Failed to fetch stores");
      }
    } catch (error) {
      const err = error as Error;
      console.error("Error fetching stores:", err);
      toast({
        title: "Error",
        description: `Failed to load stores: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingStores(false);
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
      errors.push("Valid price is required (must be greater than 0)");
    if (!formData.total_quantity || parseInt(formData.total_quantity) < 0)
      errors.push("Valid stock quantity is required (must be 0 or greater)");
    if (!formData.store_id) errors.push("Store selection is required");

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
        store_id: parseInt(formData.store_id),
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
        throw new Error(data.error || `Failed to add product: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to add product");
      }

      toast({
        title: "Success",
        description: data.message || "Product added successfully",
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
        store_id: "",
      });
      setSelectedFile(null);
      setImagePreview(null);

      // Navigate to products list
      setTimeout(() => {
        navigate("/admin/products");
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
                Add New Product
              </h1>
              <p className="text-muted-foreground mt-1">
                Create a new product in your catalog
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchStores}
              disabled={loadingStores}
            >
              {loadingStores ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Stores
            </Button>
            <Button
              className="btn-brand"
              onClick={handleAddProduct}
              disabled={saving || stores.length === 0}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PlusCircle className="h-4 w-4 mr-2" />
              )}
              {saving ? "Saving..." : "Add Product"}
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
                  <Label htmlFor="store_id">
                    Store <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.store_id}
                    onValueChange={(value) =>
                      handleSelectChange("store_id", value)
                    }
                    disabled={loadingStores || stores.length === 0}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue
                        placeholder={
                          loadingStores 
                            ? "Loading stores..." 
                            : stores.length === 0 
                              ? "No stores available" 
                              : "Select a store"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name} ({store.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {stores.length === 0 && !loadingStores && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-sm text-amber-800">
                        No stores available. Please create a store first or ask admin to approve existing stores.
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-amber-700 hover:text-amber-900 mt-1"
                        onClick={() => navigate("/admin/stores")}
                      >
                        Go to Stores →
                      </Button>
                    </div>
                  )}
                  {stores.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {stores.length} store(s) available
                    </p>
                  )}
                </div>

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
                    disabled={saving}
                  />
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
                    <p className="font-medium">APPROVED</p>
                    <p className="text-muted-foreground">Store is active and can sell products</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mt-1"></div>
                  <div>
                    <p className="font-medium">PENDING</p>
                    <p className="text-muted-foreground">Waiting for admin approval</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500 mt-1"></div>
                  <div>
                    <p className="font-medium">REJECTED</p>
                    <p className="text-muted-foreground">Store application was rejected</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500 mt-1"></div>
                  <div>
                    <p className="font-medium">SUSPENDED</p>
                    <p className="text-muted-foreground">Store is temporarily disabled</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProducts;