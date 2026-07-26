"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { setPendingImage, type PendingImageAction } from "@/lib/pending-image";
import { UploadDropzone } from "./upload-dropzone";

export function HomeUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : "", [file]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const conversion = file?.type === "image/jpeg"
    ? { label: "JPG → PNG", action: "jpg-png" as const, href: "/jpg-to-png" }
    : file?.type === "image/png"
      ? { label: "PNG → JPG", action: "png-jpg" as const, href: "/png-to-jpg" }
      : { label: "WebP → PNG", action: "webp-png" as const, href: "/jpg-to-png" };

  function openTool(action: PendingImageAction, href: string) {
    if (!file) return;
    setPendingImage(file, action);
    router.push(href);
  }

  return (
    <div className={`home-upload ${file ? "has-image" : ""}`}>
      <UploadDropzone
        onFile={setFile}
        preview={file ? { url: previewUrl, name: file.name } : undefined}
      />
      {file && (
        <section className="quick-actions" aria-labelledby="quick-actions-title">
          <div className="quick-actions-heading">
            <div><p className="eyebrow">Image ready</p><h2 id="quick-actions-title">What would you like to do?</h2></div>
            <p>Choose an action to continue with this image.</p>
          </div>
          <div className="action-groups">
            <div className="action-group">
              <h3>Convert</h3>
              <button type="button" onClick={() => openTool(conversion.action, conversion.href)}>
                <span aria-hidden="true">↗</span><strong>{conversion.label}</strong><small>Change the file format</small>
              </button>
            </div>
            <div className="action-group">
              <h3>Edit</h3>
              <div className="edit-actions">
                <button type="button" onClick={() => openTool("remove-background", "/jpg-to-png")}>
                  <span aria-hidden="true">◫</span><strong>Remove Background</strong>
                </button>
                <button type="button" onClick={() => openTool("grayscale", "/grayscale-image")}>
                  <span aria-hidden="true">◐</span><strong>Grayscale</strong>
                </button>
                <button type="button" onClick={() => openTool("invert", "/invert-image")}>
                  <span aria-hidden="true">◑</span><strong>Invert Colors</strong>
                </button>
              </div>
            </div>
          </div>
          <p className="status" role="status">Selected: {file.name}</p>
        </section>
      )}
    </div>
  );
}
