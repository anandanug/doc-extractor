import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  LayoutDashboard,
  Settings,
  ChevronRight,
  Image as ImageIcon,
  File as FileIcon,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

/**
 * Extraction Result Page — Editable
 * - Sidebar (Dashboard, Results, Settings)
 * - Document preview (image/pdf)
 * - Editable extracted fields (summary + line items)
 * - Auto-recalculate totals (optional)
 * - Download Excel from the edited data
 */

export type LineItem = {
  description?: string;
  quantity?: number | null;
  unit_price?: number | null;
  total?: number | null;
};

export type ExtractResult = {
  invoice_no?: string;
  date?: string; // ISO string
  vendor_name?: string;
  currency?: string; // e.g., "IDR"
  subtotal?: number | null;
  tax?: number | null;
  grand_total?: number | null;
  items?: LineItem[];
};

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

function formatCurrency(n?: number | null, currency: string = "IDR") {
  if (n == null || Number.isNaN(n)) return "-";
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${Number(n).toLocaleString("id-ID")}`;
  }
}

function parseNumber(input: string): number | null {
  if (!input?.trim()) return null;
  // Remove non-digit except comma/period, normalize to dot
  const normalized = input.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

async function downloadExcel(filename: string, rows: Record<string, unknown>[]) {
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
  const [data, setData] = useState<ExtractResult>(() => ({
    ...result,
    items: result.items?.map((it) => ({ ...it })) ?? [],
  }));
  const [autoCalc, setAutoCalc] = useState(true);

  useEffect(() => {
    if (!autoCalc) return;
    // Recalculate totals from items
    const itemTotal = (data.items ?? []).reduce((acc, it) => acc + (Number(it.total) || 0), 0);
    const subtotal = itemTotal;
    const tax = data.tax ?? 0; // keep user tax unless null
    const grand = subtotal + (Number(tax) || 0);
    setData((prev) => ({ ...prev, subtotal, grand_total: grand }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data.items), autoCalc]);

  const palette = useMemo(
    () => ({
      primary: "#1e3a8a",
      primaryHover: "#1d4ed8",
      bg: "#f8fafc",
      card: "#ffffff",
      border: "#e2e8f0",
      text: "#0f172a",
      sub: "#64748b",
    }),
    []
  );

  const rows = (data.items ?? []).map((it) => ({
    Deskripsi: it.description ?? "",
    Qty: it.quantity ?? "",
    "Harga Satuan": it.unit_price ?? "",
    Total: it.total ?? "",
  }));

  const handleDownload = async () => {
    await downloadExcel(
      `hasil-ekstraksi-${data.invoice_no || "invoice"}.xlsx`,
      rows
    );
  };

  const isPdf = useMemo(() => (previewUrl || "").toLowerCase().endsWith(".pdf"), [previewUrl]);

  // Handlers for summary fields
  const setField = (key: keyof ExtractResult, value: string | number | null) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Handlers for items
  const updateItem = (idx: number, patch: Partial<LineItem>) => {
    setData((prev) => {
      const next = [...(prev.items ?? [])];
      const current = { ...(next[idx] || {}) } as LineItem;
      const merged = { ...current, ...patch } as LineItem;
      // If quantity/unit_price change and autoCalc, compute total
      if (autoCalc && ("quantity" in patch || "unit_price" in patch)) {
        const q = Number(merged.quantity) || 0;
        const u = Number(merged.unit_price) || 0;
        merged.total = q * u;
      }
      next[idx] = merged;
      return { ...prev, items: next };
    });
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [...(prev.items ?? []), { description: "", quantity: null, unit_price: null, total: null }],
    }));
  };

  const removeItem = (idx: number) => {
    setData((prev) => ({
      ...prev,
      items: (prev.items ?? []).filter((_, i) => i !== idx),
    }));
  };

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
                <h1 className="text-lg font-semibold text-slate-800">Hasil Ekstraksi (Editable)</h1>
                <p className="text-xs text-slate-500">Pratinjau, koreksi data, lalu unduh Excel</p>
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
                        <p className="p-6 text-sm text-slate-500">PDF preview tidak didukung di browser ini. <a href={previewUrl} className="text-blue-700 underline">Unduh PDF</a></p>
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

              {/* Editable Result Panel */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="rounded-2xl border bg-white shadow-sm"
                style={{ borderColor: palette.border }}
              >
                <div className="flex items-center justify-between border-b p-4" style={{ borderColor: palette.border }}>
                  <h3 className="text-sm font-semibold text-slate-800">Data Ekstraksi</h3>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300"
                        checked={autoCalc}
                        onChange={(e) => setAutoCalc(e.target.checked)}
                      />
                      Auto-calc total
                    </label>
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-800 lg:hidden"
                    >
                      <Download size={16} />
                      Excel
                    </button>
                  </div>
                </div>

                {/* Summary (editable) */}
                <div className="grid grid-cols-2 gap-4 p-4 text-sm md:grid-cols-3">
                  <div>
                    <div className="text-xs text-slate-500">Vendor</div>
                    <input
                      value={data.vendor_name || ""}
                      onChange={(e) => setField("vendor_name", e.target.value)}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">No. Invoice</div>
                    <input
                      value={data.invoice_no || ""}
                      onChange={(e) => setField("invoice_no", e.target.value)}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Tanggal</div>
                    <input
                      type="date"
                      value={data.date || ""}
                      onChange={(e) => setField("date", e.target.value)}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Subtotal</div>
                    <input
                      inputMode="decimal"
                      value={data.subtotal ?? ""}
                      onChange={(e) => setField("subtotal", parseNumber(e.target.value))}
                      disabled={autoCalc}
                      className={classNames(
                        "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2",
                        autoCalc ? "bg-slate-50 text-slate-500" : "text-slate-800 focus:ring-blue-200"
                      )}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Pajak</div>
                    <input
                      inputMode="decimal"
                      value={data.tax ?? ""}
                      onChange={(e) => setField("tax", parseNumber(e.target.value))}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Total</div>
                    <div className="mt-1 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm font-semibold text-blue-800">
                      {formatCurrency(data.grand_total, data.currency)}
                    </div>
                  </div>
                </div>

                {/* Items Table (editable) */}
                <div className="p-4 pt-0">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-700">Item</div>
                    <button
                      onClick={addItem}
                      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-50"
                    >
                      <Plus size={16} /> Tambah Baris
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border" style={{ borderColor: palette.border }}>
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="p-3 text-left font-medium">Deskripsi</th>
                          <th className="p-3 text-left font-medium">Qty</th>
                          <th className="p-3 text-left font-medium">Harga Satuan</th>
                          <th className="p-3 text-left font-medium">Total</th>
                          <th className="p-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence initial={false}>
                          {(data.items ?? []).length === 0 ? (
                            <tr>
                              <td className="p-3 text-slate-500" colSpan={5}>Tidak ada item</td>
                            </tr>
                          ) : (
                            (data.items ?? []).map((it, i) => (
                              <motion.tr
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                className="border-t"
                                style={{ borderColor: palette.border }}
                              >
                                <td className="p-3 align-top">
                                  <input
                                    value={it.description ?? ""}
                                    onChange={(e) => updateItem(i, { description: e.target.value })}
                                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Deskripsi"
                                  />
                                </td>
                                <td className="p-3 align-top">
                                  <input
                                    inputMode="decimal"
                                    value={it.quantity ?? ""}
                                    onChange={(e) => updateItem(i, { quantity: parseNumber(e.target.value) })}
                                    className="w-28 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="0"
                                  />
                                </td>
                                <td className="p-3 align-top">
                                  <input
                                    inputMode="decimal"
                                    value={it.unit_price ?? ""}
                                    onChange={(e) => updateItem(i, { unit_price: parseNumber(e.target.value) })}
                                    className="w-36 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="0"
                                  />
                                </td>
                                <td className="p-3 align-top">
                                  <input
                                    inputMode="decimal"
                                    value={it.total ?? ""}
                                    onChange={(e) => updateItem(i, { total: parseNumber(e.target.value) })}
                                    disabled={autoCalc}
                                    className={classNames(
                                      "w-36 rounded-xl border px-3 py-2 outline-none focus:ring-2",
                                      autoCalc ? "bg-slate-50 text-slate-500" : "focus:ring-blue-200"
                                    )}
                                    placeholder="0"
                                  />
                                  <div className="text-xs text-slate-500 mt-1">
                                    {formatCurrency(it.total, data.currency)}
                                  </div>
                                </td>
                                <td className="p-3 align-top">
                                  <button
                                    onClick={() => removeItem(i)}
                                    className="inline-flex items-center gap-2 rounded-xl border px-2 py-2 text-xs text-red-600 transition hover:bg-red-50"
                                    aria-label="Hapus baris"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
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
                <p className="text-xs text-slate-500">Koreksi manual nilai yang kurang tepat. Gunakan Auto-calc untuk menghitung total dari Qty × Harga Satuan.</p>
              </div>
              <div className="rounded-2xl border bg-white p-5" style={{ borderColor: palette.border }}>
                <h3 className="mb-1 text-sm font-semibold text-slate-800">Langkah Selanjutnya</h3>
                <p className="text-xs text-slate-500">Unduh Excel atau sinkronkan ke Google Sheets dari menu Settings.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
