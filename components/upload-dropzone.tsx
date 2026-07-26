"use client";

import { useRef, useState } from "react";

const MAX_SIZE = 50 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateImageFile(file: File) {
  if (!ALLOWED.has(file.type)) return "Please choose a JPG, PNG, or WebP image.";
  if (file.size > MAX_SIZE) return "That file is over the 50 MB limit.";
  if (file.size === 0) return "That file appears to be empty.";
  return "";
}

export function UploadDropzone({ onFile, compact = false }: { onFile: (file: File) => void; compact?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function accept(file?: File) {
    if (!file) return;
    const message = validateImageFile(file);
    setError(message);
    if (!message) onFile(file);
  }

  return (
    <>
      <div
        className={`upload-zone ${compact ? "compact" : ""} ${dragging ? "dragging" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Upload an image by browsing or dropping it here"
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); inputRef.current?.click(); } }}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); accept(event.dataTransfer.files[0]); }}
      >
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" hidden
          onChange={(event) => { accept(event.target.files?.[0]); event.currentTarget.value = ""; }} />
        <span className="upload-icon" aria-hidden="true">↑</span>
        <strong>Drop your image here</strong>
        <small>or choose a file from your device</small>
        <button className="upload-button" type="button" onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }}>Choose image</button>
        <span className="upload-note">JPG, PNG or WebP · up to 50 MB</span>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </>
  );
}
