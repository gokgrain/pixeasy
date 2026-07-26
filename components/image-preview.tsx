/* eslint-disable @next/next/no-img-element */
export function ImagePreview({ label, url, transparent = false, empty = "Your image preview will appear here" }: { label: string; url?: string; transparent?: boolean; empty?: string }) {
  return (
    <div className="preview-wrap">
      <p className="preview-label">{label}</p>
      <div className={`preview-box ${transparent ? "checkerboard" : ""}`}>
        {/* Blob URLs are local, user-generated previews and cannot use Next image optimization. */}
        {url ? <img src={url} alt={`${label} image preview`} /> : <span className="preview-empty">{empty}</span>}
      </div>
    </div>
  );
}
