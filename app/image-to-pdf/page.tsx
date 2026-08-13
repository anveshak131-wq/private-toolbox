import type { Metadata } from "next";
import ClientTool from "./ClientTool";

export const metadata: Metadata = {
  title: "Convert Image to PDF Online Privately | Free Client-Side JPG to PDF",
  description:
    "Convert JPG, PNG, and WebP images into a single clean PDF document directly in your browser. 100% private with zero file uploads.",
  keywords: [
    "image to pdf private",
    "convert jpg to pdf browser",
    "png to pdf no upload",
    "client side photo to pdf",
    "free secure image to pdf",
  ],
};

export default function ImageToPdfPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-2xl w-full">
        <ClientTool />

        <section className="space-y-8 text-slate-300">
          <div className="border-t border-slate-800 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">
              How to Convert Images to PDF Privately
            </h2>
            <ol className="space-y-3 list-decimal list-inside text-sm text-slate-400">
              <li>
                <strong className="text-slate-200">Select Images:</strong> Choose one or multiple JPG, PNG, or WebP files from your device.
              </li>
              <li>
                <strong className="text-slate-200">Convert Instantly:</strong> Click "Convert to PDF" to let your browser assemble the document locally.
              </li>
              <li>
                <strong className="text-slate-200">Download PDF:</strong> Save the final PDF file directly to your system.
              </li>
            </ol>
          </div>

          <div className="border-t border-slate-800 pt-8 space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm space-y-1">
              <h3 className="font-semibold text-white">Are my photos sent to any server?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                No. The conversion is performed entirely in your browser using local WebAssembly JavaScript libraries.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm space-y-1">
              <h3 className="font-semibold text-white">Can I combine multiple photos into one PDF?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Yes! You can select multiple images at once, and they will all be merged in order into a single PDF file.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}