"use client";

import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";

const MAX_SIZE = 50 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateImageFile(file: File, messages: Messages["upload"]) {
  if (!ALLOWED.has(file.type)) return messages.invalidType;
  if (file.size > MAX_SIZE) return messages.tooLarge;
  if (file.size === 0) return messages.empty;
  return "";
}

export function UploadDropzone({
  onFile,
  compact = false,
  preview,
  messages,
}: {
  onFile: (file: File) => void;
  compact?: boolean;
  preview?: { url: string; name: string };
  messages: Messages["upload"];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function accept(file?: File) {
    if (!file) return;
    const message = validateImageFile(file, messages);
    setError(message);
    if (!message) onFile(file);
  }

  return (
    <>
      <div
        className={`upload-zone ${compact ? "compact" : ""} ${dragging ? "dragging" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={messages.aria}
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); inputRef.current?.click(); } }}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); accept(event.dataTransfer.files[0]); }}
      >
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" hidden
          onChange={(event) => { accept(event.target.files?.[0]); event.currentTarget.value = ""; }} />
        {preview ? (
          <div className="selected-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.url} alt={messages.selectedAlt.replace("{name}", preview.name)} />
            <div className="selected-image-meta">
              <span><strong>{preview.name}</strong><small>{messages.replaceHint}</small></span>
              <button className="replace-image-button" type="button" onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }}>{messages.replace}</button>
            </div>
          </div>
        ) : (
          <>
            <span className="upload-icon" aria-hidden="true">↑</span>
            <strong>{messages.drop}</strong>
            <small>{messages.chooseHint}</small>
            <button className="upload-button" type="button" onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }}>{messages.choose}</button>
            <span className="format-list" aria-label={messages.formats}>
              <span><b aria-hidden="true">✓</b> JPG</span>
              <span><b aria-hidden="true">✓</b> PNG</span>
              <span><b aria-hidden="true">✓</b> WebP</span>
              <span className="size-limit">{messages.maximum}</span>
            </span>
          </>
        )}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </>
  );
}
