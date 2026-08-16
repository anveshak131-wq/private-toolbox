"use client";

import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { sounds } from "../lib/soundEffects";

interface LineItem {
  desc: string;
  qty: number;
  rate: number;
}

export default function InvoiceGeneratorPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [clientName, setClientName] = useState("Acme Corp");
  const [items, setItems] = useState<LineItem[]>([
    { desc: "Software Development & Privacy Audit", qty: 1, rate: 850 },
    { desc: "Client-Side Infrastructure Setup", qty: 2, rate: 200 },
  ]);

  const addItem = () => {
    sounds.playPop();
    setItems([...items, { desc: "New Task Item", qty: 1, rate: 100 }]);
  };

  const total = items.reduce((acc, i) => acc + i.qty * i.rate, 0);

  const generatePDF = async () => {
    sounds.playSuccess();
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Header
    page.drawText("TAX INVOICE", { x: 50, y: 780, size: 24, font: fontBold, color: rgb(0.1, 0.1, 0.2) });
    page.drawText(`Invoice #: ${invoiceNumber}`, { x: 50, y: 750, size: 10, font });
    page.drawText(`Billed To: ${clientName}`, { x: 50, y: 735, size: 10, font });
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 420, y: 750, size: 10, font });

    // Table Header
    page.drawRectangle({ x: 50, y: 690, width: 495, height: 25, color: rgb(0.94, 0.95, 0.98) });
    page.drawText("Description", { x: 60, y: 698, size: 10, font: fontBold });
    page.drawText("Qty", { x: 340, y: 698, size: 10, font: fontBold });
    page.drawText("Rate ($)", { x: 410, y: 698, size: 10, font: fontBold });
    page.drawText("Amount ($)", { x: 480, y: 698, size: 10, font: fontBold });

    // Rows
    let y = 665;
    items.forEach((item) => {
      page.drawText(item.desc, { x: 60, y, size: 10, font });
      page.drawText(item.qty.toString(), { x: 345, y, size: 10, font });
      page.drawText(item.rate.toFixed(2), { x: 410, y, size: 10, font });
      page.drawText((item.qty * item.rate).toFixed(2), { x: 480, y, size: 10, font });
      y -= 25;
    });

    // Total
    page.drawLine({ start: { x: 50, y: y + 10 }, end: { x: 545, y: y + 10 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    page.drawText(`Total Balance: $${total.toFixed(2)}`, { x: 400, y: y - 15, size: 12, font: fontBold, color: rgb(0.2, 0.5, 0.2) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoiceNumber}.pdf`;
    a.click();
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Invoice PDF Generator</h1>
          <p className="text-xs text-slate-400">Generate and calculate formal PDF invoices in browser memory.</p>
        </div>
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
        >
          ⬇️ Export PDF
        </button>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Client / Company Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span>Billable Items</span>
            <button onClick={addItem} className="text-indigo-400 hover:underline">+ Add Line Item</button>
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={item.desc}
                onChange={(e) => {
                  const copy = [...items];
                  copy[idx].desc = e.target.value;
                  setItems(copy);
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="number"
                value={item.qty}
                onChange={(e) => {
                  const copy = [...items];
                  copy[idx].qty = parseInt(e.target.value) || 0;
                  setItems(copy);
                }}
                className="w-16 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="number"
                value={item.rate}
                onChange={(e) => {
                  const copy = [...items];
                  copy[idx].rate = parseFloat(e.target.value) || 0;
                  setItems(copy);
                }}
                className="w-24 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 text-sm font-bold text-emerald-400">
          Total: ${total.toFixed(2)}
        </div>
      </div>
    </main>
  );
}