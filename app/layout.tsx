import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Logo from "./components/Logo";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrivateToolbox - 100% Client-Side Web Utilities",
  description:
    "Compress, convert, merge, and edit files directly in your browser. Zero server uploads, maximum privacy.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        {/* Client-side visit tracker */}
        <AnalyticsTracker />

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="hover:opacity-90 transition">
              <Logo size="md" />
            </Link>

            <nav className="flex items-center gap-4 text-xs font-semibold">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Zero Data Stored</span>
              </div>
              <Link
                href="/"
                className="text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-900"
              >
                All Tools
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1">{children}</div>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">PrivateToolbox</span>
              <span>•</span>
              <span>All operations execute locally in your browser memory</span>
            </div>
            <p className="text-slate-600">
              © {new Date().getFullYear()} PrivateToolbox. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}