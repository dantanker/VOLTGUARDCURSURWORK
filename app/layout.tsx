import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://voltguard.com'),
  title: 'VoltGuard Electrical | 24/7 Emergency Electricians | Chicago Suburbs',
  description: 'Fast, licensed emergency electricians serving Arlington Heights, Schaumburg, Palatine & Hoffman Estates. 42-minute average response. Flat-rate pricing. Call (555) 019-2834.',
  generator: 'v0.app',
  keywords: ['emergency electrician', 'Chicago electrician', 'Arlington Heights electrician', 'Schaumburg electrician', '24/7 electrical service'],
  openGraph: {
    title: 'VoltGuard Electrical | 24/7 Emergency Electricians',
    description: 'Fast, licensed emergency electricians serving Chicago suburbs. 42-minute average response.',
    type: 'website',
    images: [
      {
        url: '/voltguard-logo-white-no-tagline.png',
        width: 1280,
        height: 384,
        alt: 'VoltGuard Electrical',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoltGuard Electrical | 24/7 Emergency Electricians',
    description: 'Fast, licensed emergency electricians serving Chicago suburbs. 42-minute average response.',
    images: ['/voltguard-logo-white-no-tagline.png'],
  },
  icons: {
    icon: [
      {
        url: '/voltguard-logo-white-no-tagline.png',
        type: 'image/png',
      },
    ],
    apple: '/voltguard-logo-white-no-tagline.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-slate-900">
      <body className="font-sans antialiased bg-slate-900">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
