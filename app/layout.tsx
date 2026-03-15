import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Madagascar Trip - Découvrez les merveilles de Madagascar',
  description:
    'Explorez Madagascar avec My Madagascar Trip : destinations, circuits et activités authentiques pour un voyage inoubliable.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GLEFK1N24T"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GLEFK1N24T');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
