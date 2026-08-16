import JSZip from "jszip";

/**
 * Downloads multiple files bundled into a single .zip file locally
 */
export async function downloadZipBundle(
  files: { name: string; blob: Blob }[],
  zipFilename: string = "privatetoolbox-export.zip"
) {
  const zip = new JSZip();

  files.forEach(({ name, blob }) => {
    zip.file(name, blob);
  });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copies an image Blob directly into the system clipboard as a PNG
 */
export async function copyImageBlobToClipboard(blob: Blob): Promise<boolean> {
  try {
    const pngBlob = blob.type === "image/png" ? blob : await convertBlobToPng(blob);
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": pngBlob,
      }),
    ]);
    return true;
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    return false;
  }
}

/**
 * Copies plain text to clipboard
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function convertBlobToPng(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => (b ? resolve(b) : reject("Blob error")), "image/png");
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}