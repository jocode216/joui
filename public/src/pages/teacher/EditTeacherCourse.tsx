
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Save,
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
  status: string;
}

const EditTeacherCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
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
    status: "",
  });

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch course details");
      }

      const course = data.data;
      setFormData({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "",
        price: course.price?.toString() || "",
        thumbnail_url: course.thumbnail_url || "",
        status: course.status || "PENDING",
      });

      if (course.thumbnail_url) {
        setImagePreview(course.thumbnail_url);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
      navigate("/teacher/courses");
    } finally {
      setLoading(false);
    }
  };

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
      setSelectedFile(null); // Clear selected file after successful upload
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

  const handleUpdateCourse = async () => {
    // Upload image first if selected but not yet uploaded
    if (selectedFile) {
      toast({
        title: "Image changed",
        description: "Please upload the new image before saving",
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
        throw new Error("Authentication required");
      }

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category.trim() || null,
        price: parseFloat(formData.price),
        thumbnail_url: formData.thumbnail_url.trim() || null,
      };

      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update course");
      }

      toast({
        title: "Success",
        description: "Course updated successfully",
      });

      // Navigate to teacher courses list
      setTimeout(() => {
        navigate("/teacher/courses");
      }, 1000);
    } catch (error) {
      const err = error as Error;
      console.error("Error updating course:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update course",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout isTeacher>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

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
                Edit Course
              </h1>
              <p className="text-muted-foreground mt-1">
                Update course details
              </p>
            </div>
          </div>
          <Button
            className="btn-brand"
            onClick={handleUpdateCourse}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Changes"}
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
                          disabled={uploadingImage}
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
                    {(imagePreview || formData.thumbnail_url) && (
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
                            src={imagePreview || formData.thumbnail_url}
                            alt="Preview"
                            className="h-32 w-32 rounded-md object-cover border"
                          />

                          <div className="flex-1 space-y-2">
                            {selectedFile ? (
                              <p className="text-sm text-muted-foreground">
                                Selected: {selectedFile.name} (
                                {(selectedFile.size / 1024).toFixed(1)} KB)
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Current Image
                              </p>
                            )}

                            {formData.thumbnail_url && (
                              <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                  Image URL:
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
                <CardTitle className="text-lg">Status Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className={`p-3 border rounded-md ${
                  formData.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                  formData.status === 'PENDING' ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <p className={`text-sm font-medium mb-1 ${
                    formData.status === 'APPROVED' ? 'text-green-800' :
                    formData.status === 'PENDING' ? 'text-amber-800' :
                    'text-red-800'
                  }`}>
                    Current Status: {formData.status}
                  </p>
                  <p className={`text-xs ${
                    formData.status === 'APPROVED' ? 'text-green-700' :
                    formData.status === 'PENDING' ? 'text-amber-700' :
                    'text-red-700'
                  }`}>
                    {formData.status === 'APPROVED' ? 'This course is live and visible to students.' :
                     formData.status === 'PENDING' ? 'Waiting for admin review. Edits may re-trigger review.' :
                     'This course needs revision.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditTeacherCourse;
