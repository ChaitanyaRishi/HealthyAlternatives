import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Healthy Alternatives',
  description: 'Find healthier alternatives to your favorite foods',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        {children}
      </body>
    </html>
  )
}
