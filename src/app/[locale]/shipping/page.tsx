import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary, isLocale, locales } from '@/lib/i18n';
import { GLYPHS, Glyph } from '@/components/Glyph';
import { SectionHeading } from '@/components/SectionHeading';
import { WhatsAppIcon } from '@/components/Icons';
import { whatsappLink } from '@/lib/store-config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'en');
  return { title: dict.shipping.title, description: dict.shipping.lead };
}

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        glyph={GLYPHS.water}
        title={dict.shipping.title}
        body={dict.shipping.lead}
        align="start"
      />

      <div className="mt-10 overflow-x-auto">
        <table className="w-full border-collapse text-start text-sm">
          <caption className="sr-only">{dict.shipping.title}</caption>
          <thead>
            <tr className="bg-lapis-900 text-papyrus-50">
              <th scope="col" className="px-4 py-3 text-start font-semibold">
                {dict.shipping.tableCountry}
              </th>
              <th scope="col" className="px-4 py-3 text-start font-semibold">
                {dict.shipping.tableTime}
              </th>
              <th scope="col" className="px-4 py-3 text-start font-semibold">
                {dict.shipping.tableCost}
              </th>
            </tr>
          </thead>
          <tbody>
            {dict.shipping.rows.map((r, i) => (
              <tr
                key={r.c}
                className={i % 2 ? 'bg-papyrus-100' : 'bg-papyrus-50'}
              >
                <th
                  scope="row"
                  className="border-b border-papyrus-300 px-4 py-3 text-start font-medium text-ink-900"
                >
                  {r.c}
                </th>
                <td className="border-b border-papyrus-300 px-4 py-3 text-ink-700 tabular-nums">
                  {r.t} {dict.shipping.days}
                </td>
                <td className="border-b border-papyrus-300 px-4 py-3 font-medium text-malachite-700">
                  {dict.shipping.free}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {[
        { h: dict.shipping.packingTitle, p: dict.shipping.packingBody, g: GLYPHS.djed },
        { h: dict.shipping.returnsTitle, p: dict.shipping.returnsBody, g: GLYPHS.scarab },
      ].map((s) => (
        <section key={s.h} className="mt-12">
          <h2 className="flex items-start gap-3 text-xl font-semibold text-ink-900">
            <Glyph char={s.g} className="mt-0.5 text-xl text-gold-600" />
            {s.h}
          </h2>
          <div className="register-rule mt-3 w-24" />
          <p className="mt-4 text-[1.02rem] leading-[1.9] text-ink-700">{s.p}</p>
        </section>
      ))}

      <section className="papyrus-grain mt-14 rounded-sm border border-papyrus-300 p-7 text-center">
        <Glyph char={GLYPHS.ankh} className="text-2xl text-gold-600" />
        <h2 className="mt-2 text-xl font-semibold text-ink-900">
          {dict.shipping.contactTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-ink-700">
          {dict.shipping.contactBody}
        </p>
        <a
          href={whatsappLink(dict.cart.whatsappIntro)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-sm bg-malachite-600 px-6 font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-malachite-700"
        >
          <WhatsAppIcon />
          {dict.shipping.contactCta}
        </a>
      </section>
    </div>
  );
}
