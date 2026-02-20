import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Upsert subscriber — reactivate if previously unsubscribed
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          name: name || null,
          status: 'active',
          source: 'website',
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
        } as any,
        { onConflict: 'email' }
      );

    if (error) {
      console.error('[Newsletter] Subscribe error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Successfully subscribed.' });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request.' },
      { status: 400 }
    );
  }
}
