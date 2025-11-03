"use client"

import { useState } from "react"
import { DocumentViewer } from "./document-viewer"
import { ExtractedDataPanelInvoice } from "./extracted-data-panel-invoice"
import { ExtractedDataPanelReceipt } from "./extracted-data-panel-receipt"
import { ExtractedDataPanelGeneric } from "./extracted-data-panel-generic"
import { Download, Check, X, RotateCw, ChevronLeft, ChevronRight } from "lucide-react"

interface ExtractionResultViewProps {
  fileName: string
  file?: File | null
  fileType?: string
  documentType?: string
  extractedData: Record<string, any>
  onSave?: (data: Record<string, any>) => void
  onExport?: (format: "json" | "csv" | "excel") => void
  onRerun?: () => void
  onCancel?: () => void
}

export function ExtractionResultView({
  fileName,
  file,
  fileType = "PDF",
  documentType = "other",
  extractedData,
  onSave,
  onExport,
  onRerun,
  onCancel,
}: ExtractionResultViewProps) {
  const [highlightedField, setHighlightedField] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDocumentCollapsed, setIsDocumentCollapsed] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      onSave?.(extractedData)
      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = (format: "json" | "csv" | "excel") => {
    const dataStr = JSON.stringify(extractedData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `extraction-${format}.${format === "json" ? "json" : format === "csv" ? "csv" : "xlsx"}`
    link.click()
    onExport?.(format)
  }

  const renderDataPanel = () => {
    const commonProps = {
      data: extractedData,
      fileName: fileName,
      onHighlightField: setHighlightedField,
      onFieldChange: (fieldName: string, value: string) => {
        extractedData[fieldName] = value
      },
    }

    switch (documentType) {
      case "invoice":
        return <ExtractedDataPanelInvoice {...commonProps} />
      case "receipt":
        return <ExtractedDataPanelReceipt {...commonProps} />
      default:
        return <ExtractedDataPanelGeneric {...commonProps} />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ekstraksi selesai</h1>
            <p className="text-sm text-muted-foreground mt-1">Tinjau dan verifikasi data yang telah diekstrak di bawah ini</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Batalkan
            </button>
            <button
              onClick={onRerun}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Ulangi Ekstraksi
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSaving ? "Menyimpan..." : "Simpan & Konfirmasi"}
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Ekspor sebagai:</span>
          <button
            onClick={() => handleExport("json")}
            className="px-3 py-1.5 text-xs font-medium border border-border rounded-md text-foreground hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            JSON
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="px-3 py-1.5 text-xs font-medium border border-border rounded-md text-foreground hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            CSV
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="px-3 py-1.5 text-xs font-medium border border-border rounded-md text-foreground hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            Excel
          </button>
        </div>
      </div>

      {/* Split View Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Extracted Data Panel - Left Panel with Expand Toggle */}
        <div
          className={`${isDocumentCollapsed ? "w-full" : "w-1/2"} min-w-0 flex flex-col relative transition-all duration-300`}
        >
          {renderDataPanel()}

          {isDocumentCollapsed && (
            <button
              onClick={() => setIsDocumentCollapsed(false)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-background border border-l-0 border-border p-1.5 hover:bg-muted transition-colors rounded-r-none z-10"
              title="Expand document viewer"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
          )}
        </div>

        {/* Document Viewer - Right Panel with Collapse Toggle */}
        {!isDocumentCollapsed && (
          <div className="w-1/2 min-w-0 flex flex-col relative">
            <DocumentViewer fileName={fileName} file={file} fileType={fileType} highlightedText={highlightedField || undefined} />

            <button
              onClick={() => setIsDocumentCollapsed(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-background border border-r-0 border-border p-1.5 hover:bg-muted transition-colors rounded-l-none z-10"
              title="Collapse document viewer"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
