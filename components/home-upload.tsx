"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setPendingImage, type PendingImageAction } from "@/lib/pending-image";
import { AdPlaceholder } from "./ad-placeholder";
import { UploadDropzone } from "./upload-dropzone";
import { localePath, type Locale, type Messages } from "@/lib/i18n";
import { compatibleUploadTools, localizedTool } from "@/lib/tool-catalog";

export function HomeUpload({ locale, messages }: { locale: Locale; messages: Messages }) {
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

  const actions = file ? compatibleUploadTools(file.type).map((tool) => {
    const item = localizedTool(tool, messages);
    return { ...item, href:localePath(locale, `/${item.slug}`) };
  }) : [];

  function openTool(action: PendingImageAction, href: string) {
    if (!file) return;
    setPendingImage(file, action);
    router.push(href);
  }

  return (
    <div ref={uploadRef} className={`home-upload ${file ? "has-image" : ""}`}>
      <UploadDropzone
        onFile={setFile}
        messages={messages.upload}
        preview={file ? { url: previewUrl, name: file.name } : undefined}
      />
      {file && (
        <>
          <section className="quick-actions" aria-labelledby="quick-actions-title">
            <div className="quick-actions-heading">
              <h2 id="quick-actions-title">{messages.upload.chooseAction}</h2>
            </div>
            <div className="action-grid">
              {actions.map((item) => (
                <button type="button" key={item.action} data-tool-id={item.id} data-tool-href={item.href} onClick={() => openTool(item.action, item.href)}>
                  <span aria-hidden="true">{item.icon}</span>
                  <span><strong>{item.label}</strong><small>{item.description}</small></span>
                </button>
              ))}
            </div>
          </section>
          <AdPlaceholder label={messages.nav.advertisement} />
        </>
      )}
    </div>
  );
}
