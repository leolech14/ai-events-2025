import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finally.Gold - AI Events Brasil 2025',
  description: 'Descubra os melhores eventos de Inteligência Artificial no Brasil em 2025',
  keywords: 'AI, Inteligência Artificial, Eventos, Brasil, 2025, Conferências, Workshops',
  authors: [{ name: 'Finally.Gold' }],
  openGraph: {
    title: 'Finally.Gold - AI Events Brasil 2025',
    description: 'Descubra os melhores eventos de Inteligência Artificial no Brasil em 2025',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://finally.gold',
    siteName: 'Finally.Gold',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finally.Gold - AI Events Brasil 2025',
    description: 'Descubra os melhores eventos de Inteligência Artificial no Brasil em 2025',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#DDB565',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}