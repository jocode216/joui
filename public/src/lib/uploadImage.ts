const IMGBB_API_KEY = "facc0f6ee6ae643cf6be34c52925b8dc";

export interface UploadImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadImageToImgBB = async (file: File): Promise<UploadImageResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: "Please select an image file (JPEG, PNG, GIF, etc.)"
      };
    }

    // Validate file size (ImgBB limit is 32MB)
    if (file.size > 32 * 1024 * 1024) {
      return {
        success: false,
        error: "Image must be less than 32MB"
      };
    }

    // Convert file to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:image/*;base64, prefix
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) resolve(base64);
        else reject(new Error('Failed to convert image to base64'));
      };
      reader.onerror = reject;
    });

    // Create FormData for the upload
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Image);
    
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        url: result.data.url || result.data.display_url
      };
    } else {
      return {
        success: false,
        error: result.error?.message || 'Upload failed'
      };
    }
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image'
    };
  }
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
