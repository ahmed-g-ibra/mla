import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

/**
 * The admin area has its own root layout: no header, no footer, no cart, no
 * locale. It is a tool for one person, not part of the shop.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-papyrus-100">{children}</body>
    </html>
  );
}
