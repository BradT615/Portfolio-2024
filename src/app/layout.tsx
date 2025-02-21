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
        <title>Brad Titus</title>
        <meta name="description" content="Brad Titus - Full Stack Developer Portfolio" />
        <meta name="google-site-verification" content="1mlH0b6ZQUcucsv7tibARouXD4ATrO8zANWKFm103d0" />

        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />


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