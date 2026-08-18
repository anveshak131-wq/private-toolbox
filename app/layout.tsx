import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://private-toolbox.pages.dev"),
  title: {
    default: "PrivateToolbox – In-Browser PDF, Image & Security Utilities",
    template: "%s | PrivateToolbox",
  },
  description:
    "Free, 100% client-side file and developer utilities. Compress images, merge PDFs, extract OCR text, and encrypt files in browser memory with zero server uploads.",
  keywords: [
    "in-browser file tools",
    "client-side pdf merger",
    "lossless image compressor offline",
    "private ocr text extractor",
    "zero upload privacy tools",
    "p2p file transfer webrtc",
  ],
  authors: [{ name: "PrivateToolbox" }],
  creator: "PrivateToolbox",
  alternates: {
    canonical: "https://private-toolbox.pages.dev",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://private-toolbox.pages.dev",
    title: "PrivateToolbox – 100% In-Browser File & Security Utilities",
    description: "Zero server uploads. Process PDFs, images, and text directly in your device memory.",
    siteName: "PrivateToolbox",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrivateToolbox – In-Browser Utilities",
    description: "Zero server uploads. Perform conversions, compression, and encryption locally.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "PrivateToolbox",
              operatingSystem: "All",
              applicationCategory: "UtilitiesApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "Zero-server file manipulation and developer utilities executing directly in client-side memory.",
              url: "https://private-toolbox.pages.dev",
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-dot-pattern antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300 transition-colors duration-200`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}