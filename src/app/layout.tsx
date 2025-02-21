// app/layout.tsx
import { Roboto_Mono } from 'next/font/google';
import ViewTracker from '@/components/ViewTracker';
import './globals.css';

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={robotoMono.className}>
      <head>
        {/* Keep your existing meta tags */}
        <title>Brad Titus</title>
        <meta name="description" content="Full Stack Developer Portfolio" />
        <meta name="google-site-verification" content="1mlH0b6ZQUcucsv7tibARouXD4ATrO8zANWKFm103d0" />
        
        {/* Explicitly add OpenGraph tags */}
        <meta property="og:url" content="https://bradtitus.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Brad Titus" />
        <meta property="og:description" content="Full Stack Developer Portfolio" />
        <meta property="og:image" content="https://bradtitus.dev/opengraph-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Brad Titus" />
        <meta name="twitter:description" content="Full Stack Developer Portfolio" />
        <meta name="twitter:image" content="https://bradtitus.dev/opengraph-image.png" />

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