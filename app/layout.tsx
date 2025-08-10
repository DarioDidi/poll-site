import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { Viewport } from 'next'
import "./globals.css";

import Providers from "@/store/Providers";
import NavBar from "@/components/common/NavBar";
import Footer from "@/components/common/Footer";

//const defaultUrl = process.env.VERCEL_URL
//  ? `https://${process.env.VERCEL_URL}`
//  : "http://localhost:3000";
//
//TODO: write out metadata
//
//export const metadata: Metadata = {
//  metadataBase: new URL(defaultUrl),
//  title: "Polling site"
//  description: "Make, manage and participate in surveys"
//};
//

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'SurveyHub - Create & Vote on Live Polls',
    template: '%s | SurveyHub'
  },
  description: 'Interactive polling platform with real-time results. Create, share and vote on polls with beautiful visualizations.',
  keywords: ['polls', 'voting', 'surveys', 'opinions', 'live results'],
  authors: [{ name: 'Your Name', url: 'https://github.com/DarioDidi' }],
  creator: 'Dario Didi',
  metadataBase: new URL('https://yourdomain.com'),
  openGraph: {
    title: 'SurveyHub - Real-time Polling Platform',
    description: 'Create and vote on interactive polls with live results',
    url: 'https://yourdomain.com',
    siteName: 'SurveyHub',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#4F46E5',
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <NavBar />
            {children}
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
