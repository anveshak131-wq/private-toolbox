export const dynamic = "force-static";

import Link from "next/link";

const toolCategories = [
  {
    category: "File & Media Utilities",
    tools: [
      {
        name: "Image Compressor",
        desc: "Compress PNG, JPG, and WebP images client-side with 0% data loss.",
        href: "/image-compressor",
        icon: "🗜️",
        badge: "Fast",
      },
      {
        name: "PDF Merger",
        desc: "Combine multiple PDF files into one single document in seconds.",
        href: "/pdf-merger",
        icon: "📑",
        badge: "Popular",
      },
      {
        name: "PDF Splitter / Deletor",
        desc: "Extract specific page ranges or delete unwanted pages from PDF files.",
        href: "/pdf-organizer",
        icon: "✂️",
        badge: "New",
      },
      {
        name: "Image to PDF",
        desc: "Convert photos and graphics directly into a clean, shareable PDF.",
        href: "/image-to-pdf",
        icon: "🖼️",
        badge: "Tool",
      },
      {
        name: "Image Resizer",
        desc: "Scale dimensions and crop images to exact pixels or aspect ratios.",
        href: "/image-resizer",
        icon: "📐",
        badge: "Utility",
      },
      {
        name: "Privacy Redactor",
        desc: "Black out sensitive text and data from images before sharing.",
        href: "/privacy-redactor",
        icon: "🛡️",
        badge: "Security",
      },
    ],
  },
  {
    category: "Converters & Developer Suite",
    tools: [
      {
        name: "JSON Formatter",
        desc: "Beautify, validate, and minify JSON data structures.",
        href: "/json-formatter",
        icon: "⚡",
        badge: "Dev",
      },
      {
        name: "Text Diff Checker",
        desc: "Compare two text blocks and highlight line additions and removals.",
        href: "/diff-checker",
        icon: "🔍",
        badge: "Dev",
      },
      {
        name: "Base64 Codec",
        desc: "Encode & decode raw text, images, and binary files to Base64.",
        href: "/base64-codec",
        icon: "🧬",
        badge: "Dev",
      },
      {
        name: "SVG Converter",
        desc: "Rasterize vector SVGs into high-res PNG, JPEG, or WebP formats.",
        href: "/svg-converter",
        icon: "🎨",
        badge: "Vector",
      },
      {
        name: "HEIC to JPEG",
        desc: "Convert Apple iPhone photos (.heic) directly in the browser.",
        href: "/heic-converter",
        icon: "📸",
        badge: "Apple",
      },
      {
        name: "QR Code Generator",
        desc: "Generate customizable QR codes for links, text, and Wi-Fi credentials.",
        href: "/qr-generator",
        icon: "📱",
        badge: "Utility",
      },
    ],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-12 text-slate-100 flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl my-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          100% Client-Side • Zero Server Uploads
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          Private Utilities for Your Everyday Work.
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Process, convert, format, and redact your files securely inside your browser memory.
        </p>
      </section>

      {/* Categorized Tools Grid */}
      <div className="w-full space-y-12 mt-6">
        {toolCategories.map((group) => (
          <div key={group.category} className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
              {group.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 backdrop-blur-md flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        {tool.icon}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700">
                        {tool.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition">
                    Open Tool →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}