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
    description: 'Full Stack Developer Portfolio',
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
      </head>
      <body className="min-h-full h-full text-[#64748c] bg-[#080b23]">
        <ViewTracker />
        {children}
      </body>
    </html>
  );
}