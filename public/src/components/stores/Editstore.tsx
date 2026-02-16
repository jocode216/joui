import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft, Store, AlertCircle } from "lucide-react";
import { z } from "zod";

const API_BASE_URL = "http://localhost:3000/api";

// Type definitions - Updated to match backend
interface FormData {
  name: string;
  description: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface StoreData {
  id: number;
  name: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  owner_id: number;
  owner_first_name: string;
  owner_last_name: string;
  owner_phone: string;
  owner_role: string;
  product_count: number;
  total_orders: number;
  created_at: string;
  approved_at?: string;
  approved_by?: number;
  rejection_reason?: string;
  statistics?: {
    total_products: number;
    active_products: number;
    total_inventory: number;
    reserved_inventory: number;
  };
  recent_products?: Array<{
    id: number;
    name: string;
    category: string;
    price: number;
    total_quantity: number;
    reserved_quantity: number;
    is_active: boolean;
  }>;
  recent_orders?: Array<{
    id: number;
    status: string;
    total_amount: number;
    created_at: string;
    first_name: string;
    last_name: string;
  }>;
}

interface StoreApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: StoreData;
  details?: Array<{ path: string[]; message: string }>;
}

// Zod validation schema - Updated to match backend
const updateStoreSchema = z.object({
  name: z
    .string()
    .min(1, "Store name is required")
    .max(150, "Store name cannot exceed 150 characters")
    .optional(),
  description: z.string().optional(),
});

const EditStore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [storeData, setStoreData] = useState<StoreData | null>(null);

  useEffect(() => {
    if (id) {
      fetchStoreData();
    }
  }, [id]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      // Fetch store details
      const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: StoreApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch store data");
      }

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch store data");
      }

      const store = data.data;
      setFormData({
        name: store.name || "",
        description: store.description || "",
      });
      
      setStoreData(store);
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to load store data",
        variant: "destructive",
      });
      navigate("/stores");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      updateStoreSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token || !id) {
        throw new Error("Authentication required. Please log in.");
      }

      // Prepare update data
      const updateData: any = {};
      if (formData.name !== storeData?.name) updateData.name = formData.name;
      if (formData.description !== storeData?.description) 
        updateData.description = formData.description || null;

      // If no changes, don't send request
      if (Object.keys(updateData).length === 0) {
        toast({
          title: "Info",
          description: "No changes detected",
        });
        setSaving(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data: StoreApiResponse = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend
        if (response.status === 400 && data.details) {
          const newErrors: FormErrors = {};
          data.details.forEach((detail) => {
            const field = detail.path[0] as string;
            newErrors[field] = detail.message;
          });
          setErrors(newErrors);
          throw new Error("Please fix the validation errors");
        }
        throw new Error(data.error || "Failed to update store");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to update store");
      }

      toast({
        title: "Success",
        description: data.message || "Store updated successfully",
      });

      // Refresh store data
      fetchStoreData();
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to update store",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading store data...</p>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Store not found</p>
          <Button onClick={() => navigate("/stores")} className="mt-4">
            Back to Stores
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/stores")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stores
          </Button>
          <h1 className="text-3xl font-bold">Edit Store</h1>
          <p className="text-muted-foreground mt-2">
            Update store information
          </p>
        </div>

        <div className="grid gap-6">
          {/* Store Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Store Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Store Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(storeData.status)}
                    {storeData.status === 'APPROVED' && storeData.approved_at && (
                      <span className="text-sm text-muted-foreground">
                        Approved on {formatDate(storeData.approved_at)}
                      </span>
                    )}
                    {storeData.status === 'REJECTED' && storeData.rejection_reason && (
                      <span className="text-sm text-red-600">
                        Reason: {storeData.rejection_reason}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="p-4 border rounded-lg">
                <Label>Store Owner</Label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{storeData.owner_first_name} {storeData.owner_last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{storeData.owner_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge variant="outline">{storeData.owner_role}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p>{formatDate(storeData.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Store Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter store name"
                    className={errors.name ? "border-destructive" : ""}
                    disabled={saving || storeData.status !== 'PENDING'}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                  {storeData.status !== 'PENDING' && (
                    <p className="text-sm text-yellow-600">
                      Store name can only be edited while in PENDING status
                    </p>
                  )}
                </div>

                {/* Store Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter store description"
                    className={errors.description ? "border-destructive" : ""}
                    disabled={saving}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/stores")}
                    className="flex-1"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-brand"
                    disabled={saving || storeData.status !== 'PENDING'}
                    title={storeData.status !== 'PENDING' ? "Only pending stores can be edited" : ""}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Store Statistics Card */}
          {storeData.statistics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Store Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">
                      {storeData.statistics.total_products || 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Active Products</p>
                    <p className="text-2xl font-bold">
                      {storeData.statistics.active_products || 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Inventory</p>
                    <p className="text-2xl font-bold">
                      {storeData.statistics.total_inventory || 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Reserved Inventory</p>
                    <p className="text-2xl font-bold">
                      {storeData.statistics.reserved_inventory || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditStore;