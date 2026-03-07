'use client';

import { useState, useRef, useCallback } from 'react';
import { uploadImageWithCompression } from '@/lib/upload';
import { useToast } from '@/components/ui/toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: 'covers' | 'avatars' | 'banners';
  folder?: string;
  label?: string;
  aspectRatio?: string;
  maxSizeMB?: number;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = 'covers',
  folder,
  label = 'Upload Image',
  aspectRatio = '16/9',
  maxSizeMB = 20,
  className = '',
}: ImageUploadProps) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyImageUrl = useCallback(() => {
    const value = imageUrlInput.trim();
    if (!value) {
      showToast({
        variant: 'error',
        title: 'Image URL is required',
        description: 'Paste a valid image URL to continue.',
      });
      return;
    }

    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      const parsed = new URL(normalized);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('invalid-protocol');
      }
      onChange(normalized);
      setImageUrlInput('');
      showToast({
        variant: 'success',
        title: 'Image URL applied',
        description: 'Cover image has been set from URL.',
      });
    } catch {
      showToast({
        variant: 'error',
        title: 'Invalid image URL',
        description: 'Use a full public image URL starting with http or https.',
      });
    }
  }, [imageUrlInput, onChange, showToast]);

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);

      try {
        if (!file.type.startsWith('image/')) {
          showToast({
            variant: 'error',
            title: 'Invalid file',
            description: 'Please upload an image file.',
          });
          return;
        }

        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
          showToast({
            variant: 'error',
            title: 'File too large',
            description: `File size must be less than ${maxSizeMB}MB.`,
          });
          return;
        }

        const result = await uploadImageWithCompression(file, bucket, folder);

        if (result.success && result.url) {
          onChange(result.url);
          showToast({
            variant: 'success',
            title: 'Image uploaded',
            description: 'The image was uploaded successfully.',
          });
        } else {
          showToast({
            variant: 'error',
            title: 'Upload failed',
            description: result.error || 'Please try again.',
          });
        }
      } catch (err) {
        showToast({
          variant: 'error',
          title: 'Upload failed',
          description: err instanceof Error ? err.message : 'An unexpected upload error occurred.',
        });
      } finally {
        setUploading(false);
      }
    },
    [bucket, folder, maxSizeMB, onChange, showToast]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemove = async () => {
    if (value) {
      onChange('');
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className="space-y-3">
          <div className="relative group rounded-2xl overflow-hidden">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-auto object-cover"
              style={{ aspectRatio }}
            />
            <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white text-ink text-[13px] font-semibold rounded-full hover:bg-white/90 transition-all"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 text-white text-[13px] font-semibold rounded-full hover:bg-red-600 transition-all"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="flex-1 px-3.5 py-2.5 bg-white border border-ink/[0.08] rounded-full text-[12px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/[0.03] transition-all"
            />
            <button
              type="button"
              onClick={applyImageUrl}
              className="px-4 py-2.5 rounded-full bg-white border border-ink/[0.1] text-[12px] font-semibold text-ink/65 hover:text-ink hover:border-ink/20 transition-all"
            >
              Use URL
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
              dragOver
                ? 'border-accent bg-accent/5'
                : 'border-ink/10 hover:border-ink/20 bg-white'
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
            style={{ aspectRatio }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              {uploading ? (
                <>
                  <div className="w-12 h-12 rounded-full border-4 border-ink/10 border-t-accent animate-spin mb-4" />
                  <p className="text-[14px] font-semibold text-ink/60">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-ink/5 flex items-center justify-center mb-4">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-ink/30"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <p className="text-[14px] font-semibold text-ink/70 mb-1">{label}</p>
                  <p className="text-[12px] text-ink/40">
                    Drop image here or click to browse
                  </p>
                  <p className="text-[11px] text-ink/30 mt-2">
                    Max {maxSizeMB}MB · JPG, PNG, WebP
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="flex-1 px-3.5 py-2.5 bg-white border border-ink/[0.08] rounded-full text-[12px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/[0.03] transition-all"
            />
            <button
              type="button"
              onClick={applyImageUrl}
              className="px-4 py-2.5 rounded-full bg-white border border-ink/[0.1] text-[12px] font-semibold text-ink/65 hover:text-ink hover:border-ink/20 transition-all"
            >
              Use URL
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
