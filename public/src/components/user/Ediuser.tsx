import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  ChevronLeft,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Save,
  Loader2,
  Lock,
  AlertCircle,
} from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const API_BASE_URL = "http://localhost:3000/api";

// Type definitions
interface FormData {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  preferred_contact: "CALL" | "WHATSAPP" | "TELEGRAM";
  telegram_username: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

// Zod validation schema - matching backend updateUserSchema
const updateUserSchema = z
  .object({
    first_name: z
      .string()
      .min(3, "First name must be at least 3 characters")
      .max(12, "First name cannot exceed 12 characters"),
    last_name: z
      .string()
      .min(3, "Last name must be at least 3 characters")
      .max(12, "Last name cannot exceed 12 characters")
      .optional(),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address cannot exceed 200 characters"),
    preferred_contact: z.enum(["CALL", "WHATSAPP", "TELEGRAM"], {
      required_error: "Please select a contact method",
    }),
    telegram_username: z
      .string()
      .max(50, "Telegram username cannot exceed 50 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.preferred_contact === "TELEGRAM") {
        return (
          data.telegram_username && data.telegram_username.trim().length > 0
        );
      }
      return true;
    },
    {
      message:
        "Telegram username is required when preferred contact is TELEGRAM",
      path: ["telegram_username"],
    },
  );

const EditUser: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    preferred_contact: "WHATSAPP",
    telegram_username: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token) {
          throw new Error("No authentication token found");
        }

        if (!userId) {
          throw new Error("User not found. Please log in.");
        }

        // Note: Using getUserById endpoint instead of profile endpoint
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expired. Please log in again.");
          }
          throw new Error(data.error || "Failed to fetch user data");
        }

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch user data");
        }

        // Set form data
        const userData = data.data;
        setFormData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          phone: userData.phone || "",
          address: userData.address || "",
          preferred_contact: userData.preferred_contact || "WHATSAPP",
          telegram_username: userData.telegram_username || "",
        });
      } catch (err) {
        const error = err as Error;
        console.error("Error fetching user:", error);
        setServerError(error.message);
        toast({
          title: "Error",
          description: error.message || "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Format input based on field
    let processedValue = value;

    if (name === "first_name" || name === "last_name") {
      // Only allow letters for names
      processedValue = value.replace(/[^a-zA-Z]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear specific field error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (serverError) setServerError("");
  };

  const handleSelectChange = (value: "CALL" | "WHATSAPP" | "TELEGRAM") => {
    setFormData((prev) => ({
      ...prev,
      preferred_contact: value,
    }));

    // Clear telegram username if not needed
    if (value !== "TELEGRAM" && formData.telegram_username) {
      setFormData((prev) => ({
        ...prev,
        telegram_username: "",
      }));
    }

    // Clear related errors
    if (errors.preferred_contact) {
      setErrors((prev) => ({ ...prev, preferred_contact: undefined }));
    }
    if (errors.telegram_username) {
      setErrors((prev) => ({ ...prev, telegram_username: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      updateUserSchema.parse(formData);
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

    // Validate form using Zod
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    setServerError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      // Prepare data for update - matching backend updateUserSchema
      const updateData: Partial<FormData> = {
        first_name: formData.first_name,
        address: formData.address,
        preferred_contact: formData.preferred_contact,
      };

      // Add optional fields only if they have values
      if (formData.last_name && formData.last_name.trim().length > 0) {
        updateData.last_name = formData.last_name;
      }

      if (
        formData.telegram_username &&
        formData.telegram_username.trim().length > 0
      ) {
        updateData.telegram_username = formData.telegram_username;
      }

      // FIXED: Using the correct endpoint - /users/profile (not /users/:id)
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend
        if (response.status === 400 && data.details) {
          const newErrors: FormErrors = {};
          data.details.forEach((detail: { field: string; message: string }) => {
            newErrors[detail.field] = detail.message;
          });
          setErrors(newErrors);
          throw new Error("Please fix the validation errors");
        }

        if (response.status === 409) {
          throw new Error("Phone number already exists");
        }

        throw new Error(
          data.error || data.message || "Failed to update profile",
        );
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update local storage
      const userName = formData.first_name;
      localStorage.setItem("userName", userName);

      // Update user info in localStorage
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        userInfo.firstName = formData.first_name;
        userInfo.lastName = formData.last_name;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

      // Show success message
      toast({
        title: "Success! ✅",
        description: data.message || "Profile updated successfully",
      });

      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      const error = err as Error;
      console.error("Error updating user:", error);
      setServerError(error.message);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              disabled={saving || loading}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
          </div>
          <p className="text-muted-foreground">
            Update your personal information
          </p>
        </div>

        {/* Edit Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Update your details below
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Server Error Display */}
              {serverError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className={`pl-10 ${errors.first_name ? "border-destructive" : ""}`}
                      placeholder="John"
                      disabled={saving}
                      maxLength={12}
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className={`pl-10 ${errors.last_name ? "border-destructive" : ""}`}
                      placeholder="Doe"
                      disabled={saving}
                      maxLength={12}
                    />
                  </div>
                  {errors.last_name && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    readOnly
                    className="pl-10 bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Phone number cannot be changed
                </p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`pl-10 ${errors.address ? "border-destructive" : ""}`}
                    placeholder="Street, City, Postal Code"
                    disabled={saving}
                    maxLength={200}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Preferred Contact */}
              <div className="space-y-2">
                <Label htmlFor="preferred_contact">
                  Preferred Contact Method *
                </Label>
                <Select
                  value={formData.preferred_contact}
                  onValueChange={handleSelectChange}
                  disabled={saving}
                >
                  <SelectTrigger
                    className={
                      errors.preferred_contact ? "border-destructive" : ""
                    }
                  >
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    <SelectItem value="CALL">Phone Call</SelectItem>
                    <SelectItem value="TELEGRAM">Telegram</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferred_contact && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.preferred_contact}
                  </p>
                )}
              </div>

              {/* Telegram Username (conditionally shown) */}
              {formData.preferred_contact === "TELEGRAM" && (
                <div className="space-y-2">
                  <Label htmlFor="telegram_username">Telegram Username *</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telegram_username"
                      name="telegram_username"
                      type="text"
                      value={formData.telegram_username}
                      onChange={handleChange}
                      className={`pl-10 ${errors.telegram_username ? "border-destructive" : ""}`}
                      placeholder="@username"
                      disabled={saving}
                      maxLength={50}
                    />
                  </div>
                  {errors.telegram_username && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.telegram_username}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full h-12 text-base font-medium"
                >
                  {saving ? (
                    <>
                      <span className="mr-2">Saving...</span>
                      <span className="animate-spin">⟳</span>
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>

              {/* Change Password Link */}
              <div className="text-center pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/change-password")}
                  disabled={saving}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
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

export default EditUser;
