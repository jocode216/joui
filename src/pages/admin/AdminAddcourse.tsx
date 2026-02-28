import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, ArrowLeft, X, Image as ImageIcon, CheckCircle } from "lucide-react";
import { z } from "zod";
import PublicHeader from "@/components/layout/PublicHeader";
import { uploadToImgBB } from "@/lib/api";

const API_BASE_URL = "http://localhost:3000/api";

interface FormData {
  title: string;
  description: string;
  price: number;
  image_url: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  details?: Array<{ path: string[]; message: string }>;
  fieldErrors?: Record<string, string>;
}

const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Course title is required")
    .max(120, "Course title cannot exceed 120 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater").default(0),
});

const AdminAddCourse: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: 0,
    image_url: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Auto-upload on file select — no separate "Upload" click needed
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 32MB",
        variant: "destructive",
      });
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-upload to ImgBB
    setUploadingImage(true);
    const url = await uploadToImgBB(file);
    setUploadingImage(false);

    if (url) {
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast({
        title: "Image uploaded",
        description: "Image ready to use",
      });
    } else {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. You can paste a URL directly below.",
        variant: "destructive",
      });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  const validateForm = (): boolean => {
    try {
      courseSchema.parse(formData);
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

      const courseData = {
        title: formData.title,
        description: formData.description || null,
        price: formData.price,
        image_url: formData.image_url || null,
      };

      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ title: "Course title already exists" });
          throw new Error("Course title already exists");
        }
        if (response.status === 400) {
          if (data.fieldErrors) {
            setErrors(data.fieldErrors);
          } else if (data.details) {
            const newErrors: FormErrors = {};
            data.details.forEach((detail) => {
              const field = detail.path[0] as string;
              newErrors[field] = detail.message;
            });
            setErrors(newErrors);
          }
          throw new Error("Please fix the validation errors");
        }
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          throw new Error("Session expired. Please log in again.");
        }
        if (response.status === 403) {
          throw new Error(data.error || "Only approved teachers can create courses");
        }
        throw new Error(data.error || "Failed to create course");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to create course");
      }

      toast({
        title: "Course Created!",
        description: "Your course is pending admin approval before it goes live.",
      });

      setTimeout(() => {
        navigate("/my-courses");
      }, 1500);
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Create New Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Introduction to Web Development"
                    className={errors.title ? "border-destructive" : ""}
                    disabled={loading}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* Course Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what students will learn..."
                    disabled={loading}
                    rows={4}
                  />
                </div>

                {/* Course Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={errors.price ? "border-destructive" : ""}
                    disabled={loading}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Set to 0 for a free course</p>
                </div>

                {/* Course Image */}
                <div className="space-y-3">
                  <Label>Course Image</Label>

                  {/* File picker — auto-uploads on select */}
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                      disabled={loading || uploadingImage}
                    />
                    {uploadingImage && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading…
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {imagePreview && (
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {formData.image_url ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">
                            {formData.image_url ? "Image ready" : "Uploading…"}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeImage}
                          className="h-8 w-8 p-0"
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-full rounded-md object-cover border"
                      />
                    </div>
                  )}

                  {/* Manual URL fallback */}
                  <div className="space-y-1">
                    <Label htmlFor="image_url" className="text-sm text-muted-foreground">
                      Or paste an image URL directly:
                    </Label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="image_url"
                        name="image_url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={loading || uploadingImage}
                      />
                    </div>
                  </div>
                </div>

                {/* Pending Notice */}
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Note:</strong> After creating your course, it will need{" "}
                    <span className="font-semibold">admin approval</span> before students can see it.
                  </p>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading || uploadingImage}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Course
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminAddCourse;