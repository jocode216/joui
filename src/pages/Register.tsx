import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/dataIhave/footer/Footer";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  teacher_name: string;
  level: string;
  category: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "STUDENT",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);

  const { refreshUser } = useRole();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle confirm_password separately
    if (name === "confirm_password") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Check for spaces (backend requirement)
    if (formData.first_name.includes(" ")) {
      errors.first_name = "First name cannot contain spaces";
    }
    if (formData.last_name.includes(" ")) {
      errors.last_name = "Last name cannot contain spaces";
    }
    if (formData.email.includes(" ")) {
      errors.email = "Email cannot contain spaces";
    }
    if (formData.phone.includes(" ")) {
      errors.phone = "Phone cannot contain spaces";
    }

    // Check if passwords match
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchRecommendedCourses = async (token?: string) => {
    setLoadingCourses(true);
    try {
      // Fetch popular/featured courses
      const response = await fetch("http://localhost:3000/api/courses?status=APPROVED&limit=6", {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecommendedCourses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const registrationData = {
        ...formData
      };

      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend
        if (data.details) {
          const backendErrors: ValidationErrors = {};
          data.details.forEach((err: any) => {
            backendErrors[err.field as keyof ValidationErrors] = err.message;
          });
          setValidationErrors(backendErrors);
        }
        throw new Error(data.error || "Registration failed");
      }

      // Store token if returned (for auto-login)
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        // Update global role state
        refreshUser();
      }

      // Set registered user data
      setRegisteredUser(data.data);

      // Update success message - no approval needed
      setSuccess(
        "🎉 Registration successful! You can now explore courses and request enrollment.",
      );

      // Clear form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        role: "STUDENT",
      });
      setConfirmPassword("");

      // Fetch recommended courses
      await fetchRecommendedCourses(data.data?.token);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseCourses = () => {
    navigate("/courses");
  };

  const handleEnrollNow = (courseId: number) => {
    if (registeredUser?.token) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate("/login");
    }
  };



  // Registration form view
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="dash-card p-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Join Jocode for free and start learning today
            </p>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">{success}</p>
                <p className="text-xs text-green-600 mt-1">
                  Redirecting...
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    First Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border ${
                      validationErrors.first_name
                        ? "border-destructive"
                        : "border-input"
                    } bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20`}
                    placeholder="John"
                    required
                  />
                  {validationErrors.first_name && (
                    <p className="mt-1 text-xs text-destructive">
                      {validationErrors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Last Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg border ${
                      validationErrors.last_name
                        ? "border-destructive"
                        : "border-input"
                    } bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20`}
                    placeholder="Doe"
                    required
                  />
                  {validationErrors.last_name && (
                    <p className="mt-1 text-xs text-destructive">
                      {validationErrors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-lg border ${
                    validationErrors.email
                      ? "border-destructive"
                      : "border-input"
                  } bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  placeholder="you@example.com"
                  required
                />
                {validationErrors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Phone <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-lg border ${
                    validationErrors.phone
                      ? "border-destructive"
                      : "border-input"
                  } bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  placeholder="+1234567890"
                  required
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-xs text-destructive">
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Password <span className="text-destructive">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-lg border ${
                    validationErrors.password
                      ? "border-destructive"
                      : "border-input"
                  } bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                {validationErrors.password && (
                  <p className="mt-1 text-xs text-destructive">
                    {validationErrors.password}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Account Type <span className="text-destructive">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="STUDENT">Student (Default)</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Administrator</option>
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select "Administrator" to test admin features
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Confirm Password <span className="text-destructive">*</span>
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Free Account"
                )}
              </button>
            </form>
            <p className="text-sm text-muted-foreground text-center mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}