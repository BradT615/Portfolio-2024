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
        url: '/OG-preview.png',
        width: 1200,
        height: 630,
        alt: 'Brad Titus - Full Stack Developer',
        // Discord and LinkedIn prefer these dimensions
        secureUrl: '/OG-preview.png', // Discord sometimes prefers secureUrl
      },
    ],
    // LinkedIn-specific
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brad Titus',
    description: 'Brad Titus - Full Stack Developer Portfolio',
    images: ['/OG-preview.png'],
    creator: '@bradtitus', // Add your Twitter handle if you have one
  },
  other: {
    // LinkedIn-specific meta tags
    'linkedin:author': 'Brad Titus',
    'linkedin:title': 'Brad Titus - Full Stack Developer Portfolio',
    'linkedin:description': 'Brad Titus - Full Stack Developer Portfolio',
    'linkedin:image': '/OG-preview.png',
    // Discord optimization
    'theme-color': '#080b23', // This will color the embed sidebar in Discord
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
        {/* These meta tags need to be added directly as they're not part of the Metadata type */}
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