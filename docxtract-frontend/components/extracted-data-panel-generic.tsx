"use client"

import { useState } from "react"
import { ChevronDown, AlertCircle } from "lucide-react"

interface ExtractedDataPanelGenericProps {
  data: Record<string, any>
  fileName: string
  onFieldChange?: (fieldName: string, value: string) => void
  onHighlightField?: (fieldName: string) => void
}

export function ExtractedDataPanelGeneric({ 
  data, 
  fileName, 
  onFieldChange, 
  onHighlightField 
}: ExtractedDataPanelGenericProps) {
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

  const items = Array.isArray(editedData.items) ? editedData.items : []
  const hasItems = items.length > 0

  // Group fields into sections
  const basicFields = Object.entries(editedData).filter(
    ([key]) => !key.includes("Item") && key !== "items"
  )

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
              {basicFields.map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-xs font-medium text-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="text"
                    value={String(value || "")}
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
                      <p className="text-xs font-medium text-muted-foreground mb-2">Item #{idx + 1}</p>
                      <div className="space-y-2">
                        {Object.entries(item).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <label className="text-xs font-medium text-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </label>
                            <input
                              type="text"
                              value={String(value || "")}
                              className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              readOnly
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confidence Info */}
        <div className="p-4 space-y-2 bg-accent bg-opacity-5 border-t border-border">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Review and edit the extracted data as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

