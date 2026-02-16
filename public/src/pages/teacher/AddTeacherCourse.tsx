import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  Loader2,
  BookOpen,
  Upload,
  X,
  PlusCircle,
  Image as ImageIcon,
} from "lucide-react";
import { uploadImageToImgBB, createImagePreview } from "@/lib/uploadImage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const COURSE_CATEGORIES = [
  "programming",
  "design",
  "business",
  "marketing",
  "photography",
  "music",
  "fitness",
  "language",
];

interface FormData {
  title: string;
  description: string;
  category: string;
  price: string;
  thumbnail_url: string;
}

const AddTeacherCourse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    price: "",
    thumbnail_url: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (32MB limit)
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
    try {
      const preview = await createImagePreview(file);
      setImagePreview(preview);
    } catch (error) {
      console.error("Error creating preview:", error);
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

    setUploadingImage(true);
    const result = await uploadImageToImgBB(selectedFile);
    setUploadingImage(false);

    if (result.success && result.url) {
      setFormData((prev) => ({
        ...prev,
        thumbnail_url: result.url!,
      }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } else {
      toast({
        title: "Upload failed",
        description: result.error || "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      thumbnail_url: "",
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

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.title.trim()) errors.push("Course title is required");
    if (!formData.price || parseFloat(formData.price) < 0)
      errors.push("Valid price is required (must be 0 or greater)");
    if (formData.price && parseFloat(formData.price) > 9999999.99) {
      errors.push("Price is too high. Maximum is 9,999,999.99");
    }

    return errors;
  };

  const handleAddCourse = async () => {
    // Upload image first if selected but not yet uploaded
    if (selectedFile && !formData.thumbnail_url) {
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

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category.trim() || null,
        price: parseFloat(formData.price),
        thumbnail_url: formData.thumbnail_url.trim() || null,
      };

      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create course");
      }

      toast({
        title: "Success! 🎉",
        description:
          data.message ||
          "Course created successfully. Awaiting admin approval.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        thumbnail_url: "",
      });
      setSelectedFile(null);
      setImagePreview(null);

      // Navigate to teacher courses list
      setTimeout(() => {
        navigate("/teacher/courses");
      }, 1500);
    } catch (error) {
      const err = error as Error;
      console.error("Error creating course:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create course",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout isTeacher>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/teacher/courses")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to My Courses
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                Create New Course
              </h1>
              <p className="text-muted-foreground mt-1">
                Add a new course to your catalog
              </p>
            </div>
          </div>
          <Button
            className="btn-brand"
            onClick={handleAddCourse}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4 mr-2" />
            )}
            {saving ? "Creating..." : "Create Course"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Course Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter course title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter course description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        {COURSE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (ETB) <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                        ETB
                      </span>
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
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Course Thumbnail</Label>

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
                          disabled={uploadingImage || !!formData.thumbnail_url}
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

                    {/* Preview */}
                    {imagePreview && (
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Preview
                          </Label>
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
                                Selected: {selectedFile.name} (
                                {(selectedFile.size / 1024).toFixed(1)} KB)
                              </p>
                            )}

                            {formData.thumbnail_url && (
                              <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                  Uploaded Image URL:
                                </Label>
                                <Input
                                  value={formData.thumbnail_url}
                                  readOnly
                                  className="text-xs"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Or use URL directly */}
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail_url">
                        Or enter image URL directly:
                      </Label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="thumbnail_url"
                          name="thumbnail_url"
                          placeholder="https://example.com/image.jpg"
                          value={formData.thumbnail_url}
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

          {/* Right Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Approval Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm font-medium text-amber-800 mb-1">
                    ⏳ Pending Approval
                  </p>
                  <p className="text-xs text-amber-700">
                    New courses require admin approval before they become
                    visible to students.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 mt-1"></div>
                    <div>
                      <p className="font-medium">APPROVED ✓</p>
                      <p className="text-muted-foreground">
                        Course is live and visible
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500 mt-1"></div>
                    <div>
                      <p className="font-medium">PENDING ⏳</p>
                      <p className="text-muted-foreground">
                        Waiting for admin review
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500 mt-1"></div>
                    <div>
                      <p className="font-medium">REJECTED ✗</p>
                      <p className="text-muted-foreground">
                        Course needs revision
                      </p>
                    </div>
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

export default AddTeacherCourse;
