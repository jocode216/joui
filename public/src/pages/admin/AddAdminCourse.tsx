
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
  status: string;
}

const AddAdminCourse = () => {
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
    status: "APPROVED", // Admins create approved courses by default
  });

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

    setSelectedFile(file);

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

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!formData.title.trim()) errors.push("Course title is required");
    if (!formData.price || parseFloat(formData.price) < 0)
      errors.push("Valid price is required");
    return errors;
  };

  const handleAddCourse = async () => {
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
        throw new Error("Authentication required");
      }

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category.trim() || null,
        price: parseFloat(formData.price),
        thumbnail_url: formData.thumbnail_url.trim() || null,
        status: formData.status,
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
        title: "Success",
        description: "Course created successfully",
      });

      setTimeout(() => {
        navigate("/admin/courses");
      }, 1000);
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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/courses")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Add New Course</h1>
              <p className="text-muted-foreground">Admin course creation</p>
            </div>
          </div>
          <Button onClick={handleAddCourse} disabled={saving} className="btn-brand">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
            Create Course
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Course Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Course Description"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {COURSE_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price (ETB)</Label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Thumbnail</Label>
                  <div className="flex gap-2">
                    <Input type="file" onChange={handleFileChange} accept="image/*" />
                    {selectedFile && (
                      <Button onClick={handleImageUpload} disabled={uploadingImage} variant="outline">
                        {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                  {(imagePreview || formData.thumbnail_url) && (
                    <div className="mt-2 relative w-full h-40 bg-secondary rounded-lg overflow-hidden border">
                      <img
                        src={imagePreview || formData.thumbnail_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                       <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={removeImage}
                            className="absolute top-2 right-2 h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddAdminCourse;
