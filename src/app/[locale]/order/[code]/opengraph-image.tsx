import { ImageResponse } from 'next/og';
import sharp from 'sharp';
import { productBySlug } from '@/data/products';
import { formatMoney } from '@/lib/currency';
import { isLocale } from '@/lib/i18n';
import { decodeOrder } from '@/lib/order-code';
import { SITE_URL } from '@/lib/seo';

export const size = { width: 1200, height: 630 };
// JPEG, not PNG: four busy photographs render to about 375KB as PNG, and
// WhatsApp becomes unreliable about fetching a preview above roughly 300KB.
export const contentType = 'image/jpeg';
export const alt = 'MLA order';

/** Four tiles is what reads at preview size; beyond that it becomes mosaic. */
const MAX_TILES = 4;

/**
 * The card WhatsApp shows for a shared order.
 *
 * Generated per request, because the order only exists in the link. Text is
 * kept to digits and Latin letters: Satori needs an embedded font for every
 * script it draws, and the piece names are often Arabic — those belong in the
 * message body, which WhatsApp renders with the system font anyway.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const loc = isLocale(locale) ? locale : 'en';
  const order = decodeOrder(code, loc);

  const tiles = (order?.lines ?? [])
    .slice(0, MAX_TILES)
    .map((l) => productBySlug(l.slug))
    .filter(Boolean)
    .map((p) => `${SITE_URL}${p!.images[0]}`);

  const extra = Math.max((order?.lines.length ?? 0) - MAX_TILES, 0);
  const total = order ? formatMoney(order.totalUsd, order.currency, 'en') : '';

  const png = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0E2444',
          padding: 56,
        }}
      >
        <div style={{ display: 'flex', flex: 1, gap: 20 }}>
          {tiles.map((src) => (
            <div
              key={src}
              style={{
                display: 'flex',
                flex: 1,
                background: '#FBF8F1',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
              }}
            >
              <img
                src={src}
                width={220}
                height={220}
                style={{ objectFit: 'contain' }}
                alt=""
              />
            </div>
          ))}
          {extra > 0 && (
            <div
              style={{
                display: 'flex',
                width: 120,
                background: 'rgba(251,248,241,0.10)',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ECD89B',
                fontSize: 44,
              }}
            >
              +{extra}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 36,
          }}
        >
          <img
            src={`${SITE_URL}/brand/logo-on-dark.png`}
            width={300}
            height={148}
            alt=""
          />
          <div
            style={{
              display: 'flex',
              color: '#FBF8EE',
              fontSize: 46,
              letterSpacing: 1,
            }}
          >
            {total}
          </div>
        </div>
      </div>
    ),
    size,
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      'Content-Type': contentType,
      // The card is a pure function of the code, so it never changes.
      'Cache-Control': 'public, immutable, max-age=31536000',
    },
  });
}
