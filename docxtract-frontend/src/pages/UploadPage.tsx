import React, { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Settings,
  LayoutDashboard,
  ChevronRight,
  Image as ImageIcon,
  File as FileIcon,
} from "lucide-react";

// NOTE:
// - This component assumes TailwindCSS is available in your app.
// - Icons use lucide-react (already available per environment notes).
// - Replace onUpload logic with your real API call later.

const MENU = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { key: "upload", label: "Upload", icon: <Upload size={18} /> },
  { key: "settings", label: "Settings", icon: <Settings size={18} /> },
];

const DOC_TYPES = [
  { value: "invoice", label: "Invoice" },
  { value: "kwitansi", label: "Kwitansi" },
  { value: "laporan", label: "Laporan Keuangan" },
];

function classNames(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function UploadPage() {
  const [activeKey, setActiveKey] = useState("upload");
  const [docType, setDocType] = useState("invoice");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const palette = useMemo(
    () => ({
      primary: "#1e3a8a", // blue-900
      primaryHover: "#1d4ed8", // blue-700
      bg: "#f8fafc", // slate-50
      card: "#ffffff",
      border: "#e2e8f0", // slate-200
      text: "#0f172a", // slate-900
      sub: "#64748b", // slate-500
    }),
    []
  );

  const onChoose = () => inputRef.current?.click();

  const validateFile = (f: File) => {
    const okType = f.type === "application/pdf" || f.type.startsWith("image/");
    const okSize = f.size <= 20 * 1024 * 1024; // 20MB
    if (!okType) return "Hanya PDF atau gambar (JPG/PNG) yang didukung.";
    if (!okSize) return "Ukuran file maksimal 20MB.";
    return null;
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const fakeUpload = async () => {
    // Demo only: simulate progress
    setIsUploading(true);
    setProgress(0);
    await new Promise<void>((resolve) => {
      let p = 0;
      const id = setInterval(() => {
        p += Math.random() * 18 + 8; // 8–26%
        if (p >= 100) {
          p = 100;
          clearInterval(id);
          resolve();
        }
        setProgress(Math.floor(p));
      }, 400);
    });
    setTimeout(() => {
      setIsUploading(false);
    }, 400);
  };

  const onUpload = async () => {
    if (!file) return;
    // Replace this with real API call
    await fakeUpload();
    // Show toast or navigate
    alert("Upload selesai! (Gantilah dengan alur nyata: kirim ke backend dan tampilkan pratinjau)");
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: palette.bg }}>
      {/* Shell */}
      <div className="mx-auto flex h-screen max-w-[1400px] overflow-hidden rounded-none">
        {/* Sidebar */}
        <aside
          className="hidden w-64 shrink-0 border-r bg-white/90 backdrop-blur md:flex md:flex-col"
          style={{ borderColor: palette.border }}
        >
          <div className="flex items-center gap-2 p-5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
              <FileText size={18} />
            </div>
            <div>
              <div className="font-semibold" style={{ color: palette.text }}>DocXtract</div>
              <div className="text-xs" style={{ color: palette.sub }}>AI Document Extractor</div>
            </div>
          </div>
          <nav className="mt-2 flex flex-1 flex-col gap-1 p-2">
            {MENU.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveKey(m.key)}
                className={classNames(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                  activeKey === m.key
                    ? "bg-blue-50 text-blue-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span className="text-slate-500 group-hover:text-inherit">{m.icon}</span>
                <span>{m.label}</span>
                {activeKey === m.key && (
                  <ChevronRight className="ml-auto" size={16} />
                )}
              </button>
            ))}
          </nav>
          <div className="p-4 text-xs text-slate-500">© 2025 DocXtract</div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
              <div>
                <h1 className="text-lg font-semibold text-slate-800">Upload Dokumen</h1>
                <p className="text-xs text-slate-500">Unggah file dan pilih tipe dokumen untuk mulai ekstraksi</p>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <div className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700">
                  Professional Palette
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-5xl p-5">
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border bg-white shadow-sm"
              style={{ borderColor: palette.border }}
            >
              <div className="flex flex-col gap-6 p-6 md:flex-row">
                {/* Upload Area */}
                <div className="flex-1">
                  <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    className={classNames(
                      "group grid place-items-center rounded-2xl border-2 border-dashed p-8 text-center transition",
                      dragOver ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                    )}
                    aria-label="Zona unggah berkas"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-600/10 text-blue-700">
                        <Upload />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          Tarik & letakkan file di sini, atau
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const el = document.getElementById("file-input");
                              el?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                            }}
                            className="ml-1 text-blue-700 underline underline-offset-4 hover:text-blue-800"
                          >
                            pilih file
                          </button>
                        </p>
                        <p className="text-xs text-slate-500">Mendukung PDF, JPG, PNG · Maks 20MB</p>
                      </div>
                      <input
                        id="file-input"
                        ref={inputRef}
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={onSelect}
                      />
                    </div>
                  </div>

                  {/* File Chip */}
                  <AnimatePresence>
                    {file && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="mt-4 inline-flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1 text-xs text-slate-700"
                      >
                        <span className="text-slate-500">
                          {file.type.startsWith("image/") ? <ImageIcon size={14} /> : <FileIcon size={14} />}
                        </span>
                        <span className="max-w-[220px] truncate md:max-w-xs" title={file.name}>{file.name}</span>
                        <span className="text-slate-400">· {(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error */}
                  {error && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                      {error}
                    </div>
                  )}
                </div>

                {/* Form Options */}
                <div className="w-full max-w-sm space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Tipe Dokumen</label>
                    <div className="relative">
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full appearance-none rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-blue-200"
                        style={{ borderColor: palette.border }}
                      >
                        {DOC_TYPES.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <ChevronRight className="rotate-90" size={16} />
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Pilih jenis untuk membantu akurasi ekstraksi.</p>
                  </div>

                  <div className="rounded-xl border p-3" style={{ borderColor: palette.border }}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Status</span>
                      <span className={classNames("font-medium", isUploading ? "text-blue-700" : "text-slate-700")}>{isUploading ? "Mengunggah…" : file ? "Siap diunggah" : "Menunggu file"}</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-[width]"
                        style={{ width: `${isUploading ? progress : file ? 25 : 0}%` }}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: file && !isUploading ? 1.02 : 1 }}
                    whileTap={{ scale: file && !isUploading ? 0.98 : 1 }}
                    disabled={!file || isUploading}
                    onClick={onUpload}
                    className={classNames(
                      "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition",
                      !file || isUploading ? "bg-blue-300" : "bg-blue-700 hover:bg-blue-800"
                    )}
                  >
                    <Upload size={16} />
                    {isUploading ? `Mengunggah ${progress}%` : "Upload Dokumen"}
                  </motion.button>

                  <p className="text-xs text-slate-500">
                    *Setelah diunggah, sistem akan memproses dan menampilkan pratinjau data.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Tips Card */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-white p-5" style={{ borderColor: palette.border }}>
                <h3 className="mb-1 text-sm font-semibold text-slate-800">Tips Unggah</h3>
                <p className="text-xs text-slate-500">Gunakan file PDF atau gambar dengan kualitas jelas, pencahayaan cukup, dan tidak miring agar akurasi lebih baik.</p>
              </div>
              <div className="rounded-2xl border bg-white p-5" style={{ borderColor: palette.border }}>
                <h3 className="mb-1 text-sm font-semibold text-slate-800">Privasi & Keamanan</h3>
                <p className="text-xs text-slate-500">Dokumen Anda diproses dengan koneksi terenkripsi. Hapus data kapan saja dari dashboard.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
