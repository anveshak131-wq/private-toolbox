"use client";

import { useState, useEffect, useCallback } from "react";

interface UseFileDropAndPasteOptions {
  onFilesAccepted: (files: File[]) => void;
  accept?: string[]; // e.g. ["image/*", "application/pdf"]
  enabled?: boolean;
}

export function useFileDropAndPaste({
  onFilesAccepted,
  accept = [],
  enabled = true,
}: UseFileDropAndPasteOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const filterFiles = useCallback(
    (files: FileList | File[]) => {
      const fileList = Array.from(files);
      if (!accept.length) return fileList;

      return fileList.filter((file) => {
        return accept.some((rule) => {
          if (rule.endsWith("/*")) {
            const typePrefix = rule.replace("/*", "");
            return file.type.startsWith(typePrefix);
          }
          return file.type === rule || file.name.endsWith(rule);
        });
      });
    },
    [accept]
  );

  useEffect(() => {
    if (!enabled) return;

    // Clipboard Paste Listener (Ctrl+V / Cmd+V)
    const handlePaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA") return;

      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }

      const validFiles = filterFiles(files);
      if (validFiles.length > 0) {
        onFilesAccepted(validFiles);
      }
    };

    // Global Drag & Drop Listeners
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        setIsDragging(false);
        dragCounter = 0;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const validFiles = filterFiles(e.dataTransfer.files);
        if (validFiles.length > 0) {
          onFilesAccepted(validFiles);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("paste", handlePaste);
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [enabled, filterFiles, onFilesAccepted]);

  return { isDragging };
}