"use client";

// Maximum allowable limits for browser memory safety
export const MAX_FILE_SIZE_MB = 60; // 60 MB hard cap to prevent tab crashes
export const MAX_IMAGE_DIMENSION = 8000; // 8000x8000 px cap to stop decompression bombs

/**
 * Validates uploaded file size and MIME category before processing
 */
export function validateUploadedFile(
  file: File,
  allowedTypes: string[] = [],
  maxSizeMB: number = MAX_FILE_SIZE_MB
): { valid: boolean; error?: string } {
  // 1. File Size Verification
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File is too large (${fileSizeMB.toFixed(1)} MB). Maximum supported size is ${maxSizeMB} MB.`,
    };
  }

  // 2. MIME Type Verification (if rules are provided)
  if (allowedTypes.length > 0) {
    const matches = allowedTypes.some((rule) => {
      if (rule.endsWith("/*")) {
        const prefix = rule.replace("/*", "");
        return file.type.startsWith(prefix);
      }
      return file.type === rule || file.name.toLowerCase().endsWith(rule);
    });

    if (!matches) {
      return {
        valid: false,
        error: `Unsupported file type (${file.type || "unknown"}). Allowed formats: ${allowedTypes.join(", ")}.`,
      };
    }
  }

  return { valid: true };
}

/**
 * Strips executable JavaScript, foreignObject, iframe, and inline event handlers from raw SVG strings
 */
export function sanitizeSvgXml(rawSvg: string): string {
  if (typeof window === "undefined") return rawSvg;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawSvg, "image/svg+xml");

    // Remove any embedded executable / embedding tags
    const dangerousTags = ["script", "foreignobject", "iframe", "object", "embed", "use", "link"];
    dangerousTags.forEach((tagName) => {
      doc.querySelectorAll(tagName).forEach((node) => node.remove());
    });

    // Remove all event listeners (onload, onclick, onerror) and javascript: URLs
    const allElements = doc.querySelectorAll("*");
    allElements.forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value.toLowerCase();

        if (name.startsWith("on") || value.includes("javascript:") || value.includes("data:text/html")) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return new XMLSerializer().serializeToString(doc);
  } catch (err) {
    console.error("SVG Sanitization Error:", err);
    return "";
  }
}

/**
 * Checks an image for decompression/pixel bombs before canvas rendering
 */
export function checkImageDimensions(
  file: File,
  maxDimension: number = MAX_IMAGE_DIMENSION
): Promise<{ valid: boolean; width: number; height: number; error?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width > maxDimension || img.height > maxDimension) {
        resolve({
          valid: false,
          width: img.width,
          height: img.height,
          error: `Image dimensions (${img.width}x${img.height}px) exceed maximum safety limit of ${maxDimension}px.`,
        });
      } else {
        resolve({ valid: true, width: img.width, height: img.height });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, width: 0, height: 0, error: "Failed to decode image payload." });
    };

    img.src = url;
  });
}

/**
 * Zeroes out sensitive memory buffers (passwords, keys) before garbage collection
 */
export function wipeMemoryBuffer(buffer: Uint8Array): void {
  buffer.fill(0);
}