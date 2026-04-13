import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeCloudinaryFolder, signCloudinaryImageUpload } from '@/lib/cloudinary/sign-upload';

/**
 * Returns a short-lived upload signature for direct browser → Cloudinary uploads.
 * Requires an authenticated user (same session as /admin). API secret never leaves the server.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const folder = sanitizeCloudinaryFolder(
    typeof body === 'object' && body !== null && 'folder' in body
      ? (body as { folder?: unknown }).folder
      : undefined
  );

  const signed = signCloudinaryImageUpload(folder);
  if (!signed) {
    return NextResponse.json(
      {
        error:
          'Cloudinary signing is not configured. Set CLOUDINARY_URL (server-only) or CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET + CLOUDINARY_CLOUD_NAME.',
      },
      { status: 503 }
    );
  }

  return NextResponse.json(signed);
}
