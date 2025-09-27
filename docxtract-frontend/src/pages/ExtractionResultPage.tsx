import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  LayoutDashboard,
  Settings,
  ChevronRight,
  Image as ImageIcon,
  File as FileIcon,
} from "lucide-react";

/**
 * Extraction Result Page
 * - Sidebar (Dashboard, Results, Settings)
 * - Document preview panel (image/pdf placeholder)
 * - Extracted summary & line items table
 * - Download Excel button (dynamic import SheetJS)
 *
 * Props you can pass later:
 *   - previewUrl?: string (blob/object URL of uploaded file for preview)
 *   - result?: ExtractResult (parsed extraction payload)
 */

// Types (inline for portability)
export type LineItem = {
  description?: string;
  quantity?: number;
  unit_price?: number;
  total?: number;
};

export type ExtractResult = {
  invoice_no?: string;
  date?: string; // ISO string
  vendor_name?: string;
  currency?: string; // e.g., "IDR"
  subtotal?: number;
  tax?: number;
  grand_total?: number;
  items?: LineItem[];
};

// Mock result (fallback demo)
const MOCK_RESULT: ExtractResult = {
  invoice_no: "INV-2025-0912",
  date: "2025-09-12",
  vendor_name: "PT Contoh Sukses Makmur",
  currency: "IDR",
  subtotal: 1250000,
  tax: 125000,
  grand_total: 1375000,
  items: [
    { description: "Produk A", quantity: 2, unit_price: 250000, total: 500000 },
    { description: "Produk B", quantity: 1, unit_price: 750000, total: 750000 },
  ],
};

const MENU = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { key: "results", label: "Results", icon: <FileText size={18} /> },
  { key: "settings", label: "Settings", icon: <Settings size={18} /> },
];

function classNames(...arr: (string | false | null | undefined)[]) {
  return arr.filter(Boolean).join(" ");
}

function formatCurrency(n?: number, currency: string = "IDR") {
  if (n == null) return "-";
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString("id-ID")}`;
  }
}

async function downloadExcel(filename: string, rows: Record<string, unknown>[]) {
  // Dynamic import to avoid forcing dependency during dev
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  const blob = new Blob([
    XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer,
  ], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ExtractionResultPage({
  previewUrl,
  result = MOCK_RESULT,
}: {
  previewUrl?: string;
  result?: ExtractResult;
}) {
  const [activeKey, setActiveKey] = useState("results");
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

  const items = result.items ?? [];
  const rows = items.map((it) => ({
    Deskripsi: it.description ?? "",
    Qty: it.quantity ?? "",
    "Harga Satuan": it.unit_price ?? "",
    Total: it.total ?? "",
  }));

  const handleDownload = async () => {
    await downloadExcel(
      `hasil-ekstraksi-${result.invoice_no || "invoice"}.xlsx`,
      rows
    );
  };

  const isPdf = useMemo(() => (previewUrl || "").toLowerCase().endsWith(".pdf"), [previewUrl]);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: palette.bg }}>
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
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
              <div>
                <h1 className="text-lg font-semibold text-slate-800">Hasil Ekstraksi</h1>
                <p className="text-xs text-slate-500">Pratinjau dokumen dan tinjau hasil teks terstruktur</p>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-800"
                >
                  <Download size={16} />
                  Download Excel
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-6xl p-5">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Preview Panel */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border bg-white shadow-sm"
                style={{ borderColor: palette.border }}
              >
                <div className="flex items-center justify-between border-b p-4" style={{ borderColor: palette.border }}>
                  <h3 className="text-sm font-semibold text-slate-800">Pratinjau Dokumen</h3>
                  <span className="text-xs text-slate-500">{previewUrl ? (isPdf ? "PDF" : "Gambar") : "Tidak ada pratinjau"}</span>
                </div>
                <div className="grid place-items-center p-4">
                  {previewUrl ? (
                    isPdf ? (
                      <object data={previewUrl} type="application/pdf" className="h-[520px] w-full rounded-xl border" style={{ borderColor: palette.border }}>
                        <p className="text-sm text-slate-500 p-6">PDF preview tidak didukung di browser ini. <a href={previewUrl} className="text-blue-700 underline">Unduh PDF</a></p>
                      </object>
                    ) : (
                      <img src={previewUrl} alt="Preview" className="max-h-[520px] w-auto rounded-xl border" style={{ borderColor: palette.border }} />
                    )
                  ) : (
                    <div className="grid h-[420px] w-full place-items-center rounded-xl border bg-slate-50" style={{ borderColor: palette.border }}>
                      <div className="text-center">
                        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-blue-600/10 text-blue-700">
                          <ImageIcon />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Belum ada pratinjau</p>
                        <p className="text-xs text-slate-500">Unggah dokumen pada halaman Upload untuk melihat tampilan di sini.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Extracted Result Panel */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="rounded-2xl border bg-white shadow-sm"
                style={{ borderColor: palette.border }}
              >
                <div className="flex items-center justify-between border-b p-4" style={{ borderColor: palette.border }}>
                  <h3 className="text-sm font-semibold text-slate-800">Data Ekstraksi</h3>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-800 lg:hidden"
                  >
                    <Download size={16} />
                    Excel
                  </button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-4 p-4 text-sm md:grid-cols-3">
                  <div>
                    <div className="text-xs text-slate-500">Vendor</div>
                    <div className="font-medium text-slate-800">{result.vendor_name || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">No. Invoice</div>
                    <div className="font-medium text-slate-800">{result.invoice_no || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Tanggal</div>
                    <div className="font-medium text-slate-800">{result.date || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Subtotal</div>
                    <div className="font-medium text-slate-800">{formatCurrency(result.subtotal, result.currency)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Pajak</div>
                    <div className="font-medium text-slate-800">{formatCurrency(result.tax, result.currency)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Total</div>
                    <div className="font-semibold text-blue-800">{formatCurrency(result.grand_total, result.currency)}</div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="p-4 pt-0">
                  <div className="overflow-x-auto rounded-xl border" style={{ borderColor: palette.border }}>
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="p-3 text-left font-medium">Deskripsi</th>
                          <th className="p-3 text-left font-medium">Qty</th>
                          <th className="p-3 text-left font-medium">Harga Satuan</th>
                          <th className="p-3 text-left font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence initial={false}>
                          {items.length === 0 ? (
                            <tr>
                              <td className="p-3 text-slate-500" colSpan={4}>Tidak ada item</td>
                            </tr>
                          ) : (
                            items.map((it, i) => (
                              <motion.tr
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                className="border-t"
                                style={{ borderColor: palette.border }}
                              >
                                <td className="p-3">{it.description ?? "-"}</td>
                                <td className="p-3">{it.quantity ?? "-"}</td>
                                <td className="p-3">{formatCurrency(it.unit_price, result.currency)}</td>
                                <td className="p-3">{formatCurrency(it.total, result.currency)}</td>
                              </motion.tr>
                            ))
                          )}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Info Cards */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-white p-5" style={{ borderColor: palette.border }}>
                <h3 className="mb-1 text-sm font-semibold text-slate-800">Catatan Akurasi</h3>
                <p className="text-xs text-slate-500">Periksa kembali nominal & tanggal. Jika keliru, koreksi manual atau unggah ulang dengan kualitas dokumen lebih jelas.</p>
              </div>
              <div className="rounded-2xl border bg-white p-5" style={{ borderColor: palette.border }}>
                <h3 className="mb-1 text-sm font-semibold text-slate-800">Langkah Selanjutnya</h3>
                <p className="text-xs text-slate-500">Unduh Excel atau lanjutkan ke integrasi Google Sheets dari menu Settings.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
