import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  User,
  Phone,
  MapPin,
  MessageSquare,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";

// Type definitions
interface FormData {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  preferred_contact: "CALL" | "WHATSAPP" | "TELEGRAM";
  telegram_username: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  userId?: string;
  role?: string;
  name?: string;
  data?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: string;
    token?: string;
    userId?: string;
  };
  details?: Array<{ field: string; message: string }>;
}

// Zod schema matching backend validation
const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(3, "First name must be at least 3 characters")
      .max(12, "First name cannot exceed 12 characters")
      .regex(/^[a-zA-Z]+$/, "First name can only contain letters"),
    last_name: z
      .string()
      .min(3, "Last name must be at least 3 characters")
      .max(12, "Last name cannot exceed 12 characters")
      .regex(/^[a-zA-Z]+$/, "Last name can only contain letters")
      .optional(),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(17, "Phone number cannot exceed 17 characters")
      .regex(/^\+?[0-9\s\-()]+$/, "Please enter a valid phone number"),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address cannot exceed 200 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(8, "Password cannot exceed 8 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(8, "Password cannot exceed 8 characters"),
    preferred_contact: z.enum(["CALL", "WHATSAPP", "TELEGRAM"], {
      required_error: "Please select a contact method",
    }),
    telegram_username: z
      .string()
      .max(50, "Telegram username cannot exceed 50 characters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    preferred_contact: "WHATSAPP",
    telegram_username: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Format input based on field
    let processedValue = value;

    if (name === "first_name" || name === "last_name") {
      // Only allow letters for names
      processedValue = value.replace(/[^a-zA-Z]/g, "");
    } else if (name === "phone") {
      // Format phone number as user types
      const digits = value.replace(/[^\d+]/g, "");
      if (digits.startsWith("+")) {
        processedValue = "+" + digits.slice(1).replace(/\D/g, "");
      } else {
        processedValue = digits;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear specific field error when user starts typing
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
      registerSchema.parse(formData);
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

        // Scroll to first error
        const firstErrorField = Object.keys(newErrors)[0];
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField);
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
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
    setServerError("");

    try {
      // Remove confirmPassword from data sent to backend
      const { confirmPassword, ...registerData } = formData;

      // Add default role (USER)
      const requestData = {
        ...registerData,
        role: "USER",
      };
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.details) {
          const newErrors: FormErrors = {};
          data.details.forEach((detail) => {
            newErrors[detail.field] = detail.message;
          });
          setErrors(newErrors);
          throw new Error("Please fix the validation errors");
        }

        if (response.status === 409) {
          throw new Error(
            "Phone number already registered. Please use a different number or login.",
          );
        }

        throw new Error(data.error || "Registration failed. Please try again.");
      }

      if (!data.success) {
        throw new Error(data.error || "Registration failed");
      }

      // Store the token and user info
      if (!data.token || !data.userId) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.name || formData.first_name);
      localStorage.setItem("userRole", data.role || "USER");

      if (data.data) {
        localStorage.setItem("userInfo", JSON.stringify(data.data));
      }

      toast({
        title: "Success! 🎉",
        description: data.message || "Account created successfully!",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const error = err as Error;
      console.error("Registration error:", error);
      setServerError(error.message);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Create Account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Join our marketplace today
          </p>
        </div>

        {/* Registration Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill in your details to get started
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
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className={`pl-10 ${errors.first_name ? "border-destructive" : ""}`}
                      placeholder="John"
                      disabled={loading}
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
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      className={`pl-10 ${errors.last_name ? "border-destructive" : ""}`}
                      placeholder="Doe"
                      disabled={loading}
                    />
                  </div>
                  {errors.last_name && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                    placeholder="+251912345678"
                    disabled={loading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`pl-10 ${errors.address ? "border-destructive" : ""}`}
                    placeholder="Street, City, Postal Code"
                    disabled={loading}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    placeholder="6-8 characters"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.confirmPassword}
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
                  disabled={loading}
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
                      disabled={loading}
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
                  disabled={loading}
                  className="w-full h-12 text-base font-medium"
                >
                  {loading ? (
                    <>
                      <span className="mr-2">Creating Account...</span>
                      <span className="animate-spin">⟳</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>

              {/* Login Link */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:underline transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
