import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Private Web Utility Toolbox | 100% Client-Side",
  description:
    "Fast, free, and completely private web micro-tools. Compress images, merge PDFs, and convert files entirely inside your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden`}
      >
        {/* Ambient Background Glow Effects */}
        <div className="fixed inset-0 pointer-events-none z-0 flex justify-center">
          <div className="w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full top-[-100px] absolute"></div>
          <div className="w-[400px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full top-[200px] right-10 absolute hidden md:block"></div>
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-white text-base tracking-tight hover:opacity-90 transition"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                🔒
              </span>
              <span>PrivateToolbox</span>
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
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
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