'use client';

import { useState, useRef } from 'react';
import { ProcessedImages } from '@/types/user-materials';
import { 
  processImage, 
  validateImageFile, 
  estimateStorageSize, 
  formatFileSize,
  getPreviewUrl 
} from '@/lib/image-processing';

interface MaterialImageUploadProps {
  currentImages?: ProcessedImages;
  onImagesChange: (images: ProcessedImages | null) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  isPro?: boolean;
}

export default function MaterialImageUpload({ 
  currentImages, 
  onImagesChange, 
  onError,
  disabled = false,
  isPro = false
}: MaterialImageUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!isPro) {
      onError('Photo upload is a Pro feature. Upgrade to add material photos.');
      return;
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      onError(validation.error || 'Invalid file');
      return;
    }

    setIsProcessing(true);

    try {
      // Process image with smart cropping and compression
      const processedImages = await processImage(file, {
        quality: 0.85,
        includeLarge: true,
        includeOriginal: false
      });

      // Estimate storage size
      const storageSize = estimateStorageSize(processedImages);
      console.log(`Processed image: ${formatFileSize(storageSize)} (from ${formatFileSize(file.size)})`);

      onImagesChange(processedImages);
    } catch (error) {
      console.error('Image processing error:', error);
      onError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveImage = () => {
    onImagesChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!isPro) {
      onError('Photo upload is a Pro feature. Upgrade to add material photos.');
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Material Photo {isPro ? '' : '(Pro Feature)'}
        </label>
        {!isPro && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pro
          </span>
        )}
      </div>

      {currentImages ? (
        // Display current image with preview
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
            <img
              src={getPreviewUrl(currentImages)}
              alt="Material preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleRemoveImage}
            disabled={disabled || isProcessing}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs"
            title="Remove photo"
          >
            ×
          </button>
        </div>
      ) : (
        // Upload area
        <div
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : isPro
              ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              : 'border-gray-200 bg-gray-50'
          } ${
            disabled || isProcessing
              ? 'opacity-50 cursor-not-allowed'
              : ''
          } ${
            !isPro ? 'cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? (
            <div className="space-y-2">
              <div className="animate-spin mx-auto h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
              <p className="text-sm text-gray-600">Processing image...</p>
              <p className="text-xs text-gray-500">Auto-cropping and compressing</p>
            </div>
          ) : (
            <div className="space-y-2">
              <svg
                className={`mx-auto h-12 w-12 ${isPro ? 'text-gray-400' : 'text-gray-300'}`}
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
              <div>
                <p className={`text-sm ${isPro ? 'text-gray-600' : 'text-gray-400'}`}>
                  {isPro ? (
                    <>
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </>
                  ) : (
                    'Photo upload requires Pro'
                  )}
                </p>
                <p className={`text-xs ${isPro ? 'text-gray-500' : 'text-gray-400'}`}>
                  {isPro ? (
                    'PNG, JPEG, WebP up to 10MB • Auto-cropped to square'
                  ) : (
                    'Upgrade to Pro for material photos'
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        disabled={disabled || isProcessing || !isPro}
        className="hidden"
      />

    </div>
  );
}