import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s | Lelang Emas Indonesia',
    default: 'Lelang Emas Indonesia - Perhiasan & Gadget Murah',
  },
  description: "Dapatkan emas sitaan bank dengan harga lelang terendah. Gratis ongkos tukang. Kualitas terjamin. Bid sekarang di Telegram!",
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'Lelang Emas Indonesia',
    description: 'Lelang Emas & Perhiasan. Harga Lelang, Gratis Ongkos Tukang.',
    url: 'https://pawnshop.group',
    siteName: 'Lelang Emas Indonesia',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lelang Emas Indonesia',
    description: 'Lelang Emas & Perhiasan. Harga Terendah.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
