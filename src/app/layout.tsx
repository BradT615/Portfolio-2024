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

        <meta property="og:url" content="https://bradtitus.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Brad Titus" />
        <meta property="og:description" content="Brad Titus - Full Stack Developer Portfolio" />
        <meta property="og:image" content="https://opengraph.b-cdn.net/production/images/e7b6b8e5-5bf9-4abd-86df-7327fc8851d7.png?token=5HEJjrkrqqz3AV7ZbHMYbllkZVmJTPnzeC2V9J5SpCY&height=630&width=1200&expires=33276165009" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="bradtitus.dev" />
        <meta property="twitter:url" content="https://bradtitus.dev" />
        <meta name="twitter:title" content="Brad Titus" />
        <meta name="twitter:description" content="Brad Titus - Full Stack Developer Portfolio" />
        <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/e7b6b8e5-5bf9-4abd-86df-7327fc8851d7.png?token=5HEJjrkrqqz3AV7ZbHMYbllkZVmJTPnzeC2V9J5SpCY&height=630&width=1200&expires=33276165009" />

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