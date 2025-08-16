'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface LogoUploadProps {
  currentLogo?: string;
  onLogoChange: (logoData: string | null) => void;
  onError?: (error: string) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIMENSIONS = 300; // 300x300px max
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

export default function LogoUpload({ currentLogo, onLogoChange, onError }: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Only run in browser environment
      if (typeof window === 'undefined') {
        reject(new Error('Image processing only available in browser.'));
        return;
      }

      // Validate file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        reject(new Error('Please upload a PNG, JPG, or SVG image file.'));
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        reject(new Error('File size must be less than 2MB.'));
        return;
      }

      // For SVG files, convert to base64 directly
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read SVG file.'));
        reader.readAsDataURL(file);
        return;
      }

      // Process raster images (PNG, JPG)
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas not supported.'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        if (width > MAX_DIMENSIONS || height > MAX_DIMENSIONS) {
          const ratio = Math.min(MAX_DIMENSIONS / width, MAX_DIMENSIONS / height);
          width *= ratio;
          height *= ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with high quality
        const dataUrl = canvas.toDataURL('image/png', 0.9);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to process image.'));

      // Create object URL for image loading
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
    });
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const processedImage = await processImage(file);
      setPreviewUrl(processedImage);
      onLogoChange(processedImage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image.';
      onError?.(errorMessage);
      console.error('Image processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [processImage, onLogoChange, onError]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemoveLogo = useCallback(() => {
    setPreviewUrl(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onLogoChange]);

  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Business Logo
        </label>
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemoveLogo}
            className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
          >
            Remove Logo
          </button>
        )}
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="flex items-center justify-center">
            <div className="relative">
              <Image
                src={previewUrl}
                alt="Logo preview"
                width={120}
                height={120}
                className="max-w-[120px] max-h-[120px] object-contain rounded-lg shadow-sm"
              />
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {isProcessing ? 'Processing image...' : 'Drag and drop your logo here, or'}
              </p>
              <button
                type="button"
                onClick={handleClickUpload}
                disabled={isProcessing}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
              >
                click to upload
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      <p className="text-xs text-gray-500">
        Upload PNG, JPG, or SVG files up to 2MB. Images will be automatically resized to fit 300×300px while maintaining aspect ratio.
      </p>
    </div>
  );
}