"use client";

import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function FilesPage() {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => setIsUploading(false), 2500);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => setIsUploading(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all w-full max-w-lg ${
          isUploading
            ? "border-amber-500/50 bg-amber-500/5"
            : "border-slate-700 hover:border-blue-500 hover:bg-slate-900"
        }`}
      >
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
        <UploadCloud className={`w-14 h-14 mb-4 ${isUploading ? "text-amber-400 animate-bounce" : "text-slate-400"}`} />
        <span className="text-lg font-semibold text-slate-200">
          {isUploading ? "reading files" : "drop your file here"}
        </span>
        <span className="text-sm text-slate-500 mt-2">png, jpg</span>
      </label>
    </div>
  );
}