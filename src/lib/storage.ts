import { createClient } from '@/lib/supabase/client';

const BUCKET_NAME = 'media';

export async function uploadImage(file: File, path: string): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split('.').pop();
  const filePath = `${path}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const supabase = createClient();

  // Extract path from URL
  const path = url.split(`${BUCKET_NAME}/`).pop();
  if (!path) return;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) throw error;
}
