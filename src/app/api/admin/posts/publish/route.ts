import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

type PublishRequest = {
  ids: string[];
};

export async function POST(req: Request) {
  let body: PublishRequest | null = null;
  try {
    body = (await req.json()) as PublishRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const ids = Array.isArray(body?.ids) ? body.ids.filter((id) => typeof id === 'string' && id.length > 0) : [];
  if (ids.length === 0) {
    return NextResponse.json({ success: true, published: 0 });
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('posts')
      .update({
        status: 'published',
        published_at: now,
        updated_at: now,
      })
      .in('id', ids)
      .eq('status', 'draft')
      .select('id');

    if (error) {
      return NextResponse.json({ success: false, error: error.message, published: 0 }, { status: 500 });
    }

    revalidatePath('/admin/posts');
    revalidatePath('/admin');
    revalidatePath('/');

    return NextResponse.json({ success: true, published: data?.length ?? 0 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Publish failed', published: 0 },
      { status: 500 }
    );
  }
}
