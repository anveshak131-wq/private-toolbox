import type { Metadata } from "next";
import ClientTool from "./ClientTool";

export const metadata: Metadata = {
  title: "Resize Image Online Privately | Free Browser Photo Resizer & Converter",
  description:
    "Resize image dimensions in pixels and convert formats between JPG, PNG, and WebP directly in your browser. 100% private, client-side resizer.",
  keywords: [
    "resize image private",
    "image dimension resizer browser",
    "convert png to webp no upload",
    "client side photo resizer",
    "free secure picture resizer",
  ],
};

export default function ImageResizerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-2xl w-full">
        <ClientTool />

        <section className="space-y-8 text-slate-300">
          <div className="border-t border-slate-800 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">
              How to Resize Images Privately
            </h2>
            <ol className="space-y-3 list-decimal list-inside text-sm text-slate-400">
              <li>
                <strong className="text-slate-200">Upload Photo:</strong> Select any PNG, JPG, or WebP file from your computer.
              </li>
              <li>
                <strong className="text-slate-200">Set Dimensions & Format:</strong> Enter custom width or height values and choose your export format.
              </li>
              <li>
                <strong className="text-slate-200">Download:</strong> Save your newly resized image instantly.
              </li>
            </ol>
          </div>

          <div className="border-t border-slate-800 pt-8 space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm space-y-1">
              <h3 className="font-semibold text-white">Does resizing images reduce file quality?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Downscaling image dimensions generally maintains or improves sharpness while significantly reducing file size.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm space-y-1">
              <h3 className="font-semibold text-white">Will my photos remain private?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Yes. All image processing uses your local browser graphics engine (HTML5 Canvas). No images leave your computer.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}