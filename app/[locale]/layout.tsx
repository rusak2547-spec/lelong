import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Pawnshop Brunei',
    default: 'Pawnshop Brunei - Lelong Emas & Barang Kemas',
  },
  description: "Dapatkan emas sitaan Ar-Rahnu & Bank dengan harga lelong. Bebas Upah Tukang. Kualiti Terjamin. Sertai bidaan di Telegram Pawnshop_vip.",
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'Pawnshop Brunei',
    description: 'Lelong Emas & Barang Kemas. Harga Lelong, Bebas Upah.',
    url: 'https://pawnshop-brunei.com', // Placeholder URL
    siteName: 'Pawnshop Brunei',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'ms_MY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pawnshop Brunei',
    description: 'Lelong Emas & Barang Kemas. Harga Lelong.',
    images: ['/logo.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
