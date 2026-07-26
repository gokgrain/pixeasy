"use client";

import { useState } from "react";
import { UploadDropzone } from "./upload-dropzone";

export function HomeUpload() {
  const [fileName, setFileName] = useState("");
  return (
    <div>
      <UploadDropzone onFile={(file) => setFileName(file.name)} />
      {fileName && <p className="status" role="status">“{fileName}” is ready — choose a tool below to continue.</p>}
    </div>
  );
}
