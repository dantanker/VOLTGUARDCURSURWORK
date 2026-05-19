import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'VoltGuard Electrical | 24/7 Emergency Electricians | Chicago Suburbs',
  description: 'Fast, licensed emergency electricians serving Arlington Heights, Schaumburg, Palatine & Hoffman Estates. 42-minute average response. Flat-rate pricing. Call (555) 019-2834.',
  generator: 'v0.app',
  keywords: ['emergency electrician', 'Chicago electrician', 'Arlington Heights electrician', 'Schaumburg electrician', '24/7 electrical service'],
  openGraph: {
    title: 'VoltGuard Electrical | 24/7 Emergency Electricians',
    description: 'Fast, licensed emergency electricians serving Chicago suburbs. 42-minute average response.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
