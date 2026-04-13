import { v2 as cloudinary } from 'cloudinary';

export type CloudinaryServerCredentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

/**
 * Read Cloudinary API credentials for server-side signing only.
 * Prefer `CLOUDINARY_URL` (server-only env, never NEXT_PUBLIC).
 */
export function getCloudinaryServerCredentials(): CloudinaryServerCredentials | null {
  const rawUrl = process.env.CLOUDINARY_URL?.trim();
  if (rawUrl?.startsWith('cloudinary://')) {
    try {
      const u = new URL(rawUrl.replace(/^cloudinary:\/\//, 'https://'));
      const cloudName = u.hostname;
      const apiKey = decodeURIComponent(u.username);
      const apiSecret = decodeURIComponent(u.password);
      if (cloudName && apiKey && apiSecret) {
        return { cloudName, apiKey, apiSecret };
      }
    } catch {
      // fall through
    }
  }

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME?.trim() || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }

  return null;
}

const MAX_FOLDER_LEN = 220;

/** Safe folder path for Cloudinary (no traversal, limited charset). */
export function sanitizeCloudinaryFolder(input: unknown): string | undefined {
  if (typeof input !== 'string') return undefined;
  const t = input.trim();
  if (!t || t.length > MAX_FOLDER_LEN) return undefined;
  if (t.includes('..') || t.startsWith('/') || t.includes('\\')) return undefined;
  if (!/^[\w\-/]+$/.test(t)) return undefined;
  return t;
}

export type SignedUploadPayload = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder?: string;
};

/**
 * Parameters signed here must be sent unchanged on the multipart upload request.
 */
export function signCloudinaryImageUpload(folder?: string): SignedUploadPayload | null {
  const creds = getCloudinaryServerCredentials();
  if (!creds) return null;

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = { timestamp };
  if (folder) paramsToSign.folder = folder;

  const signature = cloudinary.utils.api_sign_request(paramsToSign, creds.apiSecret);

  return {
    timestamp,
    signature,
    apiKey: creds.apiKey,
    cloudName: creds.cloudName,
    ...(folder ? { folder } : {}),
  };
}
