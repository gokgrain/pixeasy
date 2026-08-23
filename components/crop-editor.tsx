"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import type { NormalizedCrop } from "@/lib/crop";

type DragKind = "move" | "nw" | "ne" | "sw" | "se";

const minimum = .08;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function CropEditor({
  label, url, crop, ratio, onChange, selectionLabel,
}: {
  label: string;
  url: string;
  crop: NormalizedCrop;
  ratio: number | null;
  onChange: (crop: NormalizedCrop) => void;
  selectionLabel: string;
}) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ kind: DragKind; startX: number; startY: number; crop: NormalizedCrop } | null>(null);

  function startDrag(kind: DragKind, event: PointerEvent) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { kind, startX: event.clientX, startY: event.clientY, crop };
  }

  function moveDrag(event: PointerEvent) {
    const drag = dragRef.current;
    const bounds = surfaceRef.current?.getBoundingClientRect();
    if (!drag || !bounds) return;
    const dx = (event.clientX - drag.startX) / bounds.width;
    const dy = (event.clientY - drag.startY) / bounds.height;
    let next = { ...drag.crop };

    if (drag.kind === "move") {
      next.x = clamp(drag.crop.x + dx, 0, 1 - drag.crop.width);
      next.y = clamp(drag.crop.y + dy, 0, 1 - drag.crop.height);
    } else {
      const left = drag.kind.endsWith("w");
      const top = drag.kind.startsWith("n");
      const anchorX = left ? drag.crop.x + drag.crop.width : drag.crop.x;
      const anchorY = top ? drag.crop.y + drag.crop.height : drag.crop.y;
      let pointerX = clamp(left ? drag.crop.x + dx : drag.crop.x + drag.crop.width + dx, 0, 1);
      let pointerY = clamp(top ? drag.crop.y + dy : drag.crop.y + drag.crop.height + dy, 0, 1);
      let width = Math.max(minimum, Math.abs(anchorX - pointerX));
      let height = Math.max(minimum, Math.abs(anchorY - pointerY));
      if (ratio) {
        const surfaceRatio = bounds.width / bounds.height;
        const normalizedRatio = ratio / surfaceRatio;
        if (width / height > normalizedRatio) height = width / normalizedRatio;
        else width = height * normalizedRatio;
      }
      width = Math.min(width, left ? anchorX : 1 - anchorX);
      height = Math.min(height, top ? anchorY : 1 - anchorY);
      if (ratio) {
        const surfaceRatio = bounds.width / bounds.height;
        const normalizedRatio = ratio / surfaceRatio;
        if (width / height > normalizedRatio) width = height * normalizedRatio;
        else height = width / normalizedRatio;
      }
      pointerX = left ? anchorX - width : anchorX + width;
      pointerY = top ? anchorY - height : anchorY + height;
      next = { x: Math.min(anchorX, pointerX), y: Math.min(anchorY, pointerY), width, height };
    }
    onChange(next);
  }

  function nudge(kind: DragKind, event: KeyboardEvent) {
    const amount = event.shiftKey ? .02 : .005;
    const direction = event.key === "ArrowLeft" ? [-amount, 0] : event.key === "ArrowRight" ? [amount, 0] : event.key === "ArrowUp" ? [0, -amount] : event.key === "ArrowDown" ? [0, amount] : null;
    if (!direction) return;
    event.preventDefault();
    const [dx, dy] = direction;
    if (kind === "move") {
      onChange({ ...crop, x: clamp(crop.x + dx, 0, 1 - crop.width), y: clamp(crop.y + dy, 0, 1 - crop.height) });
      return;
    }
    const next = { ...crop };
    if (kind.includes("w")) { next.x = clamp(crop.x + dx, 0, crop.x + crop.width - minimum); next.width = crop.width + crop.x - next.x; }
    if (kind.includes("e")) next.width = clamp(crop.width + dx, minimum, 1 - crop.x);
    if (kind.includes("n")) { next.y = clamp(crop.y + dy, 0, crop.y + crop.height - minimum); next.height = crop.height + crop.y - next.y; }
    if (kind.includes("s")) next.height = clamp(crop.height + dy, minimum, 1 - crop.y);
    onChange(next);
  }

  return (
    <div className="preview-wrap crop-preview-wrap">
      <p className="preview-label">{label}</p>
      <div className="crop-stage checkerboard">
        {/* The image is a local blob URL and cannot use Next image optimization. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={`${label} image preview`} />
        <div ref={surfaceRef} className="crop-surface" aria-label={selectionLabel}>
          <div className="crop-shade crop-shade-top" style={{ height: `${crop.y * 100}%` }} />
          <div className="crop-shade crop-shade-left" style={{ top: `${crop.y * 100}%`, width: `${crop.x * 100}%`, height: `${crop.height * 100}%` }} />
          <div className="crop-shade crop-shade-right" style={{ top: `${crop.y * 100}%`, left: `${(crop.x + crop.width) * 100}%`, height: `${crop.height * 100}%` }} />
          <div className="crop-shade crop-shade-bottom" style={{ top: `${(crop.y + crop.height) * 100}%` }} />
          <div
            className="crop-frame"
            role="application"
            tabIndex={0}
            aria-label={selectionLabel}
            style={{ left: `${crop.x * 100}%`, top: `${crop.y * 100}%`, width: `${crop.width * 100}%`, height: `${crop.height * 100}%` }}
            onPointerDown={(event) => startDrag("move", event)}
            onPointerMove={moveDrag}
            onPointerUp={() => { dragRef.current = null; }}
            onKeyDown={(event) => nudge("move", event)}
          >
            {(["nw", "ne", "sw", "se"] as DragKind[]).map((kind) => (
              <button
                key={kind}
                type="button"
                className={`crop-handle crop-handle-${kind}`}
                aria-label={`${selectionLabel} ${kind}`}
                onPointerDown={(event) => { event.stopPropagation(); startDrag(kind, event); }}
                onPointerMove={moveDrag}
                onPointerUp={() => { dragRef.current = null; }}
                onKeyDown={(event) => nudge(kind, event)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
