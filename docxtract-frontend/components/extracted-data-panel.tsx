"use client"

import { useState } from "react"
import { ChevronDown, AlertCircle, Trash2 } from "lucide-react"

interface ExtractedField {
  name: string
  value: string
  confidence?: number
  highlighted?: boolean
}

interface ExtractedDataPanelProps {
  data: Record<string, any>
  fileName: string
  onFieldChange?: (fieldName: string, value: string) => void
  onHighlightField?: (fieldName: string) => void
}

export function ExtractedDataPanel({ data, fileName, onFieldChange, onHighlightField }: ExtractedDataPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["basic", "items"]))
  const [editedData, setEditedData] = useState(data)

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setEditedData({ ...editedData, [fieldName]: value })
    onFieldChange?.(fieldName, value)
  }

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return "text-muted-foreground"
    if (confidence >= 0.9) return "text-green-600"
    if (confidence >= 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  const items = Array.isArray(editedData.items) ? editedData.items : []
  const hasItems = items.length > 0

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Extracted Data</h2>
        <p className="text-xs text-muted-foreground">{fileName}</p>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-auto">
        {/* Basic Information Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("basic")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold text-sm text-foreground">Basic Information</h3>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                expandedSections.has("basic") ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.has("basic") && (
            <div className="px-4 py-3 space-y-4 bg-background bg-opacity-30">
              {Object.entries(editedData)
                .filter(([key]) => !key.includes("Item") && key !== "items")
                .map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <div className={`text-xs font-medium ${getConfidenceColor(0.95)}`}>{Math.round(0.95 * 100)}%</div>
                    </div>
                    <input
                      type="text"
                      value={String(value)}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      onFocus={() => onHighlightField?.(key)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Items Section */}
        {hasItems && (
          <div className="border-b border-border">
            <button
              onClick={() => toggleSection("items")}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold text-sm text-foreground">Line Items ({items.length})</h3>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  expandedSections.has("items") ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.has("items") && (
              <div className="px-4 py-3 space-y-4 bg-background bg-opacity-30">
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-border rounded-lg space-y-3 hover:bg-background hover:bg-opacity-5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Item #{idx + 1}</p>
                        </div>
                        <button className="text-destructive hover:bg-destructive hover:bg-opacity-10 p-1 rounded transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Nomor / Item Number */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Nomor</label>
                          <input
                            type="text"
                            defaultValue={item.nomor || item.itemNumber || `${idx + 1}`}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        {/* Nama Produk / Product Name */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Nama Produk</label>
                          <input
                            type="text"
                            defaultValue={item.namaProduk || item.description || item.productName || ""}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        {/* Jumlah / Quantity */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Jumlah</label>
                          <input
                            type="number"
                            defaultValue={item.jumlah || item.quantity || ""}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground text-right focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        {/* Harga / Price */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Harga</label>
                          <input
                            type="text"
                            defaultValue={item.harga || item.price || ""}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground text-right focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        {/* Total / Total Price */}
                        <div className="col-span-2 space-y-1">
                          <label className="text-xs font-medium text-foreground">Total</label>
                          <input
                            type="text"
                            defaultValue={item.total || item.totalPrice || ""}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground text-right focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full text-sm py-2 px-3 border border-dashed border-border rounded-md text-primary hover:bg-primary hover:bg-opacity-5 transition-colors font-medium">
                  + Add Item
                </button>
              </div>
            )}
          </div>
        )}

        {/* Confidence Info */}
        <div className="p-4 space-y-2 bg-accent bg-opacity-5 border-t border-border">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Values with higher confidence scores are more likely to be accurate. Review and edit as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
