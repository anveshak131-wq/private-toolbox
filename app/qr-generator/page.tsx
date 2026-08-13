import type { Metadata } from "next";
import ClientTool from "./ClientTool";

export const metadata: Metadata = {
  title: "Free Private QR Code Generator | Custom Downloadable PNG QR Codes",
  description:
    "Generate custom, colorable QR codes for links and text directly inside your browser. 100% private QR generator with zero tracking or analytics.",
  keywords: [
    "private qr code generator",
    "create custom qr code no tracking",
    "free png qr generator",
    "client side qr maker",
    "secure link to qr code",
  ],
};

export default function QrGeneratorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-2xl w-full">
        <ClientTool />

        <section className="space-y-8 text-slate-300">
          <div className="border-t border-slate-800 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">
              How to Create Custom QR Codes Privately
            </h2>
            <ol className="space-y-3 list-decimal list-inside text-sm text-slate-400">
              <li>
                <strong className="text-slate-200">Enter Input:</strong> Paste your URL, plain text, or contact information.
              </li>
              <li>
                <strong className="text-slate-200">Customize Colors:</strong> Choose custom foreground and background colors.
              </li>
              <li>
                <strong className="text-slate-200">Download PNG:</strong> Save your high-resolution QR code image immediately.
              </li>
            </ol>
          </div>

          <div className="border-t border-slate-800 pt-8 space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm space-y-1">
              <h3 className="font-semibold text-white">Do generated QR codes ever expire?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                No. These are direct, static QR codes that point straight to your destination without redirection servers, so they work forever.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm space-y-1">
              <h3 className="font-semibold text-white">Is my data logged when creating a QR code?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Never. The QR code image is generated instantly using client-side JavaScript inside your browser.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}