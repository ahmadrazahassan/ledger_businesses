import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Ledger Businesses';
  const category = searchParams.get('category') || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          backgroundColor: '#f8f9fa',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top — brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo mark */}
          <div
            style={{
              width: 48,
              height: 48,
              border: '3px solid #1e1f26',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 800,
              color: '#1e1f26',
            }}
          >
            LB
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#1e1f26',
              textTransform: 'uppercase',
            }}
          >
            Ledger Businesses
          </span>
        </div>

        {/* Center — title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {category && (
            <span
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                backgroundColor: '#ff5533',
                color: '#1e1f26',
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 9999,
                alignSelf: 'flex-start',
              }}
            >
              {category}
            </span>
          )}
          <h1
            style={{
              fontSize: title.length > 60 ? 40 : 52,
              fontWeight: 800,
              color: '#1e1f26',
              lineHeight: 1.15,
              maxWidth: '90%',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom — tagline */}
        <div
          style={{
            fontSize: 14,
            color: '#808080',
            letterSpacing: '0.05em',
          }}
        >
          The authority in business intelligence
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
