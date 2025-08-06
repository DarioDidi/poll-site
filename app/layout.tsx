import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
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
      <body className={`${geistSans.className} antialiased`}>
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
