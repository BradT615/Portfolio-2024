import type { Metadata } from "next";
import { Roboto_Mono } from 'next/font/google';
import ViewTracker from '@/components/ViewTracker';
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Brad Titus",
  description: "Brad Titus - Full Stack Developer Portfolio",
  authors: [{ name: "Brad Titus" }],
  verification: {
    google: "1mlH0b6ZQUcucsv7tibARouXD4ATrO8zANWKFm103d0",
  },
  openGraph: {
    type: 'website',
    title: 'Brad Titus',
    description: 'Brad Titus - Full Stack Developer Portfolio',
    siteName: 'Brad Titus',
    url: 'https://bradtitus.dev',
    images: [
      {
        url: 'https://bradtitus.dev/OG-preview.png',
        width: 1200,
        height: 630,
        alt: 'Brad Titus - Full Stack Developer',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brad Titus',
    description: 'Brad Titus - Full Stack Developer Portfolio',
    images: ['https://bradtitus.dev/OG-preview.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={robotoMono.className}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" 
        />
        {/* Additional meta tags for better compatibility */}
        <meta property="og:image:secure_url" content="https://bradtitus.dev/OG-preview.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
      </head>
      <body className="min-h-full h-full text-[#64748c] bg-[#080b23]">
        <ViewTracker />
        {children}
      </body>
    </html>
  );
}