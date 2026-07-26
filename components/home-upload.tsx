"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setPendingImage, type PendingImageAction } from "@/lib/pending-image";
import { AdPlaceholder } from "./ad-placeholder";
import { UploadDropzone } from "./upload-dropzone";

export function HomeUpload() {
  const router = useRouter();
  const uploadRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : "", [file]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (!file) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      const top = uploadRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 68 || top > 108) {
        uploadRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    }, reduceMotion ? 0 : 330);
    return () => window.clearTimeout(timer);
  }, [file]);

  const conversion = file?.type === "image/jpeg"
    ? { label: "JPG → PNG", action: "jpg-png" as const, href: "/jpg-to-png" }
    : file?.type === "image/png"
      ? { label: "PNG → JPG", action: "png-jpg" as const, href: "/png-to-jpg" }
      : null;

  const actions: { label: string; description?: string; icon: string; action: PendingImageAction; href: string }[] = [
    ...(conversion ? [{ ...conversion, icon: "↗" }] : []),
    ...(file?.type === "image/jpeg" ? [{
      label: "Remove Background",
      description: "Create a transparent PNG",
      icon: "◫",
      action: "remove-background" as const,
      href: "/jpg-to-png",
    }] : []),
    { label: "Grayscale", icon: "◐", action: "grayscale", href: "/grayscale-image" },
    { label: "Invert Colors", icon: "◑", action: "invert", href: "/invert-image" },
  ];

  function openTool(action: PendingImageAction, href: string) {
    if (!file) return;
    setPendingImage(file, action);
    router.push(href);
  }

  return (
    <div ref={uploadRef} className={`home-upload ${file ? "has-image" : ""}`}>
      <UploadDropzone
        onFile={setFile}
        preview={file ? { url: previewUrl, name: file.name } : undefined}
      />
      {file && (
        <>
          <section className="quick-actions" aria-labelledby="quick-actions-title">
            <div className="quick-actions-heading">
              <h2 id="quick-actions-title">Choose an action</h2>
            </div>
            <div className="action-grid">
              {actions.map((item) => (
                <button type="button" key={item.action} onClick={() => openTool(item.action, item.href)}>
                  <span aria-hidden="true">{item.icon}</span>
                  <span><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span>
                </button>
              ))}
            </div>
          </section>
          <AdPlaceholder />
        </>
      )}
    </div>
  );
}
