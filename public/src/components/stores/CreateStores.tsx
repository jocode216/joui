import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, ArrowLeft } from "lucide-react";
import { z } from "zod";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const API_BASE_URL = "http://localhost:3000/api";

// Type definitions - Updated to match backend
interface FormData {
  name: string;
  description: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  storeId?: string;
  details?: Array<{ path: string[]; message: string }>;
}

// Zod validation schema - Updated to match backend
const storeSchema = z.object({
  name: z
    .string()
    .min(1, "Store name is required")
    .max(150, "Store name cannot exceed 150 characters"),
  description: z.string().optional(),
});

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      storeSchema.parse(formData);
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

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(`${API_BASE_URL}/stores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
        }),
      });

      const data: ApiResponse = await response.json();

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
        throw new Error(data.error || "Failed to create store");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to create store");
      }

      toast({
        title: "Success",
        description: data.message || "Store created successfully",
      });

      // Navigate to stores list after success
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to create store",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <Header />
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Enter a descriptive name for the store (max 150 characters)
                </p>
              </div>

              {/* Store Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter store description (optional)"
                  className={errors.description ? "border-destructive" : ""}
                  disabled={loading}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Briefly describe what your store sells or offers
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> After creating your store, it will be
                  in "PENDING" status and will require admin approval before it
                  can be used.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 btn-brand"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Store
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default CreateStore;
