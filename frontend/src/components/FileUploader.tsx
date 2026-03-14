import { useState } from "react";

export function FileUploader({
  onUpload,
}: {
  onUpload: (file: File) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await onUpload(file);
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept=".pdf,.docx,.png,.jpg,.jpeg"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full rounded-xl border border-slate-300 p-2 text-sm"
      />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Uploading..." : "Upload Document"}
      </button>
    </div>
  );
}
