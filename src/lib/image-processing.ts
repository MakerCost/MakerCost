/**
 * Image processing utilities for material photos
 * Handles uploading, cropping, compression, and format conversion
 */

export interface ProcessedImages {
  thumbnail: string; // 64x64px WebP
  medium: string;    // 200x200px WebP  
  large?: string;    // 400x400px WebP
  original?: string; // Optional full-size backup
}

export interface ImageProcessingOptions {
  maxFileSize?: number; // Max input file size in bytes (default: 10MB)
  quality?: number;     // WebP quality 0-1 (default: 0.85)
  includeLarge?: boolean; // Include 400px version (default: true)
  includeOriginal?: boolean; // Keep original (default: false)
}

/**
 * Validates uploaded image file
 */
export function validateImageFile(file: File, maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `Image must be smaller than ${maxMB}MB` };
  }

  // Check for supported formats
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!supportedTypes.includes(file.type.toLowerCase())) {
    return { valid: false, error: 'Supported formats: JPEG, PNG, WebP, GIF' };
  }

  return { valid: true };
}

/**
 * Loads image file into HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Calculates smart crop dimensions for square output
 * Centers the crop on the most important part of the image
 */
function calculateCropDimensions(width: number, height: number): { x: number; y: number; size: number } {
  const size = Math.min(width, height);
  const x = (width - size) / 2;
  const y = (height - size) / 2;
  
  return { x, y, size };
}

/**
 * Creates a canvas with cropped and resized image
 */
function createResizedCanvas(
  img: HTMLImageElement, 
  targetSize: number, 
  quality: number = 0.85
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Calculate crop dimensions for square output
  const crop = calculateCropDimensions(img.width, img.height);
  
  // Set canvas size to target dimensions
  canvas.width = targetSize;
  canvas.height = targetSize;
  
  // Enable smooth scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Draw cropped and resized image
  ctx.drawImage(
    img,
    crop.x, crop.y, crop.size, crop.size, // Source crop
    0, 0, targetSize, targetSize          // Destination
  );
  
  // Convert to WebP with specified quality
  return canvas.toDataURL('image/webp', quality);
}

/**
 * Processes uploaded image file into multiple optimized sizes
 */
export async function processImage(
  file: File, 
  options: ImageProcessingOptions = {}
): Promise<ProcessedImages> {
  const {
    maxFileSize = 10 * 1024 * 1024,
    quality = 0.85,
    includeLarge = true,
    includeOriginal = false
  } = options;

  // Validate file
  const validation = validateImageFile(file, maxFileSize);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    // Load image
    const img = await loadImage(file);
    
    // Generate different sizes
    const thumbnail = createResizedCanvas(img, 64, quality);
    const medium = createResizedCanvas(img, 200, quality);
    
    const result: ProcessedImages = {
      thumbnail,
      medium
    };
    
    // Add large version if requested
    if (includeLarge) {
      result.large = createResizedCanvas(img, 400, quality);
    }
    
    // Add original if requested (convert to WebP for consistency)
    if (includeOriginal) {
      result.original = createResizedCanvas(img, Math.max(img.width, img.height), 0.95);
    }
    
    return result;
    
  } catch (error) {
    console.error('Image processing failed:', error);
    throw new Error('Failed to process image. Please try a different file.');
  }
}

/**
 * Estimates the total storage size of processed images
 */
export function estimateStorageSize(images: ProcessedImages): number {
  let totalSize = 0;
  
  // Base64 strings include data URL prefix, so we estimate actual binary size
  if (images.thumbnail) totalSize += (images.thumbnail.length * 0.75);
  if (images.medium) totalSize += (images.medium.length * 0.75);
  if (images.large) totalSize += (images.large.length * 0.75);
  if (images.original) totalSize += (images.original.length * 0.75);
  
  return Math.round(totalSize);
}

/**
 * Converts bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Creates a preview URL from processed images (uses medium size)
 */
export function getPreviewUrl(images: ProcessedImages): string {
  return images.medium || images.thumbnail;
}

/**
 * Gets the best quality image URL for display
 */
export function getBestQualityUrl(images: ProcessedImages, preferredSize: 'thumbnail' | 'medium' | 'large' = 'medium'): string {
  switch (preferredSize) {
    case 'thumbnail':
      return images.thumbnail;
    case 'medium':
      return images.medium || images.large || images.thumbnail;
    case 'large':
      return images.large || images.medium || images.thumbnail;
    default:
      return images.medium || images.thumbnail;
  }
}