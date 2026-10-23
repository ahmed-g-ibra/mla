import Link from 'next/link';
import { GLYPHS, Glyph } from '@/components/Glyph';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <Glyph char={GLYPHS.wedjat} className="text-5xl text-papyrus-400" />
      <h1 className="mt-5 text-3xl font-semibold text-ink-900">
        Nothing here / لا شيء هنا
      </h1>
      <div className="register-rule mx-auto mt-4 w-28" />
      <p className="mt-4 text-ink-500">
        This page does not exist. · هذه الصفحة غير موجودة.
      </p>
      <Link
        href="/en"
        className="mt-7 inline-flex min-h-12 cursor-pointer items-center rounded-sm bg-lapis-800 px-6 font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-lapis-900"
      >
        MLA
      </Link>
    </div>
  );
}
