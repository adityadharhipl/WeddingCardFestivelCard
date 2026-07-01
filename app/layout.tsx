// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Dwivedi – Premium Wedding Invitation Gallery',
  description: 'Discover and order stunning wedding, birthday, and anniversary invitation designs. Premium quality prints delivered to your door.',
  keywords: 'wedding invitations, birthday cards, anniversary cards, premium invitations',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Dwivedi – Premium Wedding Invitation Gallery',
    description: 'Premium invitation designs for every celebration.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff2d78" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dwivedi" />
        <link rel="apple-touch-icon" href="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=192" />
      </head>
      <body>
        <div className="toaster-wrap">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1c23',
                color: '#fff',
                border: '1px solid #ffffff1f',
                borderRadius: '14px',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#ff2d78', secondary: '#fff' } },
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
