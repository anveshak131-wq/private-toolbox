import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import AnalyticsTracker from "./components/AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://private-toolbox.pages.dev"),
  title: {
    default: "PrivateToolbox | 100% Client-Side Web Utility Tools",
    template: "%s | PrivateToolbox",
  },
  description:
    "Free, fast, and completely private browser tools. Compress images, merge PDFs, and redact screenshots with zero server uploads.",
  keywords: [
    "client-side image compressor",
    "private pdf merger no upload",
    "free screenshot redactor online",
    "browser utility tools",
  ],
  openGraph: {
    title: "PrivateToolbox | 100% Client-Side Web Utility Tools",
    description:
      "Compress images, merge PDFs, and generate QR codes privately inside your browser. No file uploads.",
    url: "https://private-toolbox.pages.dev",
    siteName: "PrivateToolbox",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google AdSense Verification Script in <head> */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1912611953756071"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden`}
      >
        {/* Client-Side Visitor Tracker */}
        <AnalyticsTracker />

        {/* Ambient Background Glow Effects */}
        <div className="fixed inset-0 pointer-events-none z-0 flex justify-center">
          <div className="w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full top-[-100px] absolute"></div>
          <div className="w-[400px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full top-[200px] right-10 absolute hidden md:block"></div>
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="hover:opacity-90 transition">
              <Logo size="md" />
            </Link>

            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                100% Client-Side
              </span>
              <a
                href="https://rzp.io/rzp/0ZgwLn17"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl transition shadow-lg shadow-emerald-600/20 font-semibold"
              >
                ⚡ Support
              </a>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-grow z-10 relative">{children}</div>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}