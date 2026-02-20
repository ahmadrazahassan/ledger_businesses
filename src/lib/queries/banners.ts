import type { Banner, BannerFormData, BannerPlacement } from '@/lib/types/database';
import { createClient } from '@/lib/supabase/client';

export async function getActiveBanners(placement?: BannerPlacement): Promise<Banner[]> {
  const supabase = createClient();
  const now = new Date().toISOString();

  let query = supabase
    .from('banners')
    .select('*')
    .eq('active', true)
    .lte('start_date', now)
    .gte('end_date', now);

  if (placement) {
    query = query.eq('placement_key', placement);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Banner[]) || [];
}

export async function getAllBanners(): Promise<Banner[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Banner[]) || [];
}

export async function createBanner(formData: BannerFormData): Promise<Banner> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('banners')
    .insert(formData)
    .select()
    .single();

  if (error) throw error;
  return data as Banner;
}

export async function updateBanner(id: string, formData: Partial<BannerFormData>): Promise<Banner> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('banners')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Banner;
}

export async function deleteBanner(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw error;
}
