import type { Metadata } from "next";
import ClientTool from "./ClientTool";

export const metadata: Metadata = {
  title: "Merge PDF Files Online Privately | Free Client-Side PDF Joiner",
  description:
    "Combine multiple PDF documents into one seamless file entirely inside your browser. Fast, free, and 100% private PDF merger with zero server uploads.",
  keywords: [
    "merge pdf private free",
    "combine pdf files online no upload",
    "secure pdf merger",
    "client side pdf joiner",
    "merge confidential pdfs",
  ],
};

export default function PdfMergerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-2xl w-full">
        {/* Interactive Tool Component */}
        <ClientTool />

        {/* SEO Article & How It Works */}
        <section className="space-y-8 text-slate-300">
          <div className="border-t border-slate-800 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">
              How to Combine PDFs Privately
            </h2>
            <ol className="space-y-3 list-decimal list-inside text-sm text-slate-400">
              <li>
                <strong className="text-slate-200">Upload Files:</strong> Select two or more PDF documents from your computer.
              </li>
              <li>
                <strong className="text-slate-200">Merge Instantly:</strong> Click "Merge PDFs" to let browser WebAssembly process pages.
              </li>
              <li>
                <strong className="text-slate-200">Download:</strong> Save your combined PDF directly to your device.
              </li>
            </ol>
          </div>

          {/* SEO FAQ Section */}
          <div className="border-t border-slate-800 pt-8 space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm space-y-1">
              <h3 className="font-semibold text-white">Is it safe to merge confidential bank statements or legal PDFs here?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Yes! Because all calculations happen directly inside your browser via local JavaScript libraries (`pdf-lib`), your private documents never leave your computer or travel over the internet.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm space-y-1">
              <h3 className="font-semibold text-white">Why use client-side PDF merging over traditional online converters?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Traditional sites require you to upload full files to their cloud servers, creating potential data leaks and slow processing times. Client-side tools work instantly and guarantee total privacy.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}