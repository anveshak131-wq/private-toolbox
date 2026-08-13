import type { Metadata } from "next";
import ClientTool from "./ClientTool";

export const metadata: Metadata = {
  title: "Free Private Image Compressor | Reduce Image Size Online Without Uploading",
  description:
    "Compress JPG, PNG, and WebP images directly inside your browser. 100% private client-side image compression with zero server file uploads.",
  keywords: [
    "compress image online",
    "private image compressor",
    "reduce png size browser",
    "client side image compression",
    "free image shrinker no upload",
  ],
};

export default function ImageCompressorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-2xl w-full">
        {/* Interactive Tool Component */}
        <ClientTool />

        {/* SEO Article & How It Works */}
        <section className="space-y-8 text-slate-300">
          <div className="border-t border-slate-800 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">
              How to Compress Images Privately in 3 Easy Steps
            </h2>
            <ol className="space-y-3 list-decimal list-inside text-sm text-slate-400">
              <li>
                <strong className="text-slate-200">Adjust Quality:</strong> Set your desired compression level using the slider.
              </li>
              <li>
                <strong className="text-slate-200">Select File:</strong> Upload any JPG, PNG, or WebP photo directly from your device.
              </li>
              <li>
                <strong className="text-slate-200">Instant Download:</strong> Your image is instantly processed by your browser for download.
              </li>
            </ol>
          </div>

          {/* SEO FAQ Section */}
          <div className="border-t border-slate-800 pt-8 space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm space-y-1">
              <h3 className="font-semibold text-white">Are my photos uploaded to a remote server?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                No. Unlike standard online image compressors, our tool processes images entirely inside your web browser using client-side JavaScript and HTML5 Canvas API. Your files never touch any external server.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm space-y-1">
              <h3 className="font-semibold text-white">Is there a file size limit or daily usage restriction?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                There are no file size caps or daily usage quotas. Since processing runs on your own computer hardware, you can compress as many files as you like completely free.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}