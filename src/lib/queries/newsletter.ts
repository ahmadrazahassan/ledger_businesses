import { createClient } from '@/lib/supabase/client';

export async function subscribeNewsletter(email: string, name?: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // Use the server-side RPC function for upsert logic
  const { error: rpcError } = await supabase
    .rpc('subscribe_newsletter', {
      subscriber_email: email,
      subscriber_name: name || null,
    });

  if (rpcError) {
    // Fallback: direct insert
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        name: name || null,
        status: 'active',
        source: 'website',
      });

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation — already subscribed
        return { success: true };
      }
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

export async function unsubscribeNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('email', email.toLowerCase().trim());

  if (error) return { success: false, error: error.message };
  return { success: true };
}
