// Centralized API helper, constants, and utilities

export const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:3000/api";
export const IMGBB_API_KEY = "facc0f6ee6ae643cf6be34c52925b8dc";

// Authenticated API call helper
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { error: "Invalid response from server" };
  }

  if (!response.ok) {
    throw new Error(data.error || data.msg || `Request failed with status ${response.status}`);
  }

  return data;
};

// Upload image to ImgBB, returns URL string or null
export const uploadToImgBB = async (file: File): Promise<string | null> => {
  try {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result?.toString().split(",")[1];
        if (result) resolve(result);
        else reject(new Error("Failed to convert image"));
      };
      reader.onerror = reject;
    });

    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", base64);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      return result.data.url || result.data.display_url;
    }
    throw new Error(result.error?.message || "Upload failed");
  } catch (error) {
    console.error("ImgBB upload error:", error);
    return null;
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

// Format date helper
export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString();
};

// Format currency
export const formatPrice = (price?: number) => {
  if (!price || price === 0) return "Free";
  return `$${Number(price).toLocaleString()}`;
};
