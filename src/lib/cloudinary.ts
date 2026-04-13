/**
 * Client-safe Cloudinary helpers.
 *
 * Production: signed direct uploads (API secret stays on server via `/api/cloudinary/sign`).
 * Fallback: unsigned uploads with NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (e.g. local dev).
 */

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ||
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim()
  );
}

/**
 * Extract Cloudinary `public_id` (incl. folder path + extension) from a delivery URL, if possible.
 */
export function cloudinaryPublicIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith('res.cloudinary.com')) return null;
    const marker = '/upload/';
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    let rest = u.pathname.slice(idx + marker.length);
    const parts = rest.split('/').filter(Boolean);
    let i = 0;
    while (i < parts.length && parts[i].includes(',')) i++;
    if (i < parts.length && /^v\d+$/.test(parts[i])) i++;
    const id = parts.slice(i).join('/');
    return id ? decodeURIComponent(id) : null;
  } catch {
    return null;
  }
}

type SignResponse =
  | { timestamp: number; signature: string; apiKey: string; cloudName: string; folder?: string }
  | { error?: string };

/**
 * Upload a single image: prefers authenticated signed upload; falls back to unsigned preset.
 */
export async function uploadToCloudinary(
  file: File,
  options?: {
    folder?: string;
    maxSizeMB?: number;
  }
): Promise<CloudinaryUploadResult> {
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'File must be an image' };
  }

  const maxMB = options?.maxSizeMB ?? 20;
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { success: false, error: `File size must be less than ${maxMB}MB` };
  }

  const publicCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
  const folderOpt = options?.folder?.trim();

  const formData = new FormData();
  formData.append('file', file);

  let cloudName: string | undefined;

  try {
    const signRes = await fetch('/api/cloudinary/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ folder: folderOpt || undefined }),
    });

    if (signRes.ok) {
      const sig = (await signRes.json()) as SignResponse;
      if ('signature' in sig && 'apiKey' in sig && 'cloudName' in sig && 'timestamp' in sig) {
        cloudName = sig.cloudName;
        formData.append('api_key', sig.apiKey);
        formData.append('timestamp', String(sig.timestamp));
        formData.append('signature', sig.signature);
        if (sig.folder) formData.append('folder', sig.folder);
      }
    } else if (signRes.status === 401) {
      return { success: false, error: 'Sign in to upload images.' };
    }

    if (!cloudName) {
      if (!uploadPreset || !publicCloud) {
        return {
          success: false,
          error:
            'Cloudinary uploads are not configured. For production, set server-only CLOUDINARY_URL (see README). For development you may set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.',
        };
      }
      cloudName = publicCloud;
      formData.append('upload_preset', uploadPreset);
      if (folderOpt) formData.append('folder', folderOpt);
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = (await res.json()) as {
      secure_url?: string;
      public_id?: string;
      error?: { message?: string };
    };

    if (!res.ok) {
      const message = data.error?.message ?? `Upload failed (${res.status})`;
      return { success: false, error: message };
    }

    if (!data.secure_url) {
      return { success: false, error: 'Upload succeeded but no image URL was returned.' };
    }

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (e) {
    console.error('[uploadToCloudinary]', e);
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Network error during upload',
    };
  }
}
