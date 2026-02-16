import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Phone, Lock, LogIn, Shield, AlertCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";

// Type definitions
interface FormData {
  phone: string;
  password: string;
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
const loginSchema = z.object({
  phone: z
    .string()
    .min(5, "Phone number must be at least 5 digits")
    .max(30, "Phone number cannot exceed 30 characters")
    .regex(/^[+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),
  password: z.string().min(1, "Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format phone number as user types
    let processedValue = value;
    if (name === "phone") {
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

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
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
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend
        if (response.status === 400 && data.details) {
          const newErrors: FormErrors = {};
          data.details.forEach((detail) => {
            newErrors[detail.field] = detail.message;
          });
          setErrors(newErrors);
          throw new Error("Please fix the validation errors");
        }
        
        if (response.status === 401) {
          throw new Error("Invalid phone number or password. Please check your credentials.");
        }
        
        throw new Error(data.error || "Login failed. Please try again.");
      }

      if (!data.success) {
        throw new Error(data.error || "Login failed");
      }

      // Store the token and user info
      const token = data.data?.token || data.token;
      const userId = data.data?.userId || data.userId;
      const userName = data.data?.firstName || formData.phone;
      const userRole = data.data?.role || data.role || "USER";

      if (!token || !userId) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userRole", userRole);

      // Store user info
      const userInfo = {
        firstName: data.data?.firstName || userName,
        lastName: data.data?.lastName || "",
        phone: data.data?.phone || formData.phone,
        role: userRole,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      // Show success message with role information
      let roleMessage = "";
      switch(userRole) {
        case "ADMIN":
          roleMessage = "Welcome, Administrator!";
          break;
        case "STORE_OWNER":
          roleMessage = "Welcome, Store Owner!";
          break;
        default:
          roleMessage = "Welcome back!";
      }

      toast({
        title: "Login Successful! 🎉",
        description: roleMessage,
      });

      // Redirect based on role after a short delay
      setTimeout(() => {
        switch(userRole) {
          case "ADMIN":
            navigate("/admin");
            break;
          case "STORE_OWNER":
            navigate("/store");
            break;
          default:
            navigate("/");
        }
      }, 1000);
    } catch (err) {
      const error = err as Error;
      setServerError(error.message || "An error occurred during login");
      toast({
        title: "Login Failed",
        description: error.message || "Unable to sign in. Please try again.",
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
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your account
          </p>
        </div>

        <div className="grid gap-6">
          {/* Login Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to continue
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
                      placeholder="+1234567890"
                      disabled={loading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password *</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
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
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-medium"
                  >
                    {loading ? (
                      <>
                        <span className="mr-2">Signing in...</span>
                        <span className="animate-spin">⟳</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      New to our platform?
                    </span>
                  </div>
                </div>

                {/* Register Button */}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/register")}
                    disabled={loading}
                  >
                    Create New Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Login;