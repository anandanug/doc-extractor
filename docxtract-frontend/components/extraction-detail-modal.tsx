"use client"

import { X } from "lucide-react"
import type { StoredExtraction } from "@/lib/storage-utils"

interface ExtractionDetailModalProps {
  extraction: StoredExtraction | null
  isOpen: boolean
  onClose: () => void
}

export function ExtractionDetailModal({ extraction, isOpen, onClose }: ExtractionDetailModalProps) {
  if (!isOpen || !extraction) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{extraction.filename}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(extraction.date).toLocaleDateString()} • {extraction.type}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">FILE SIZE</p>
              <p className="text-lg font-medium text-foreground">{extraction.size}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">STATUS</p>
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  extraction.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : extraction.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {extraction.status.charAt(0).toUpperCase() + extraction.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Extracted Data */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Extracted Data</h3>
            <div className="space-y-3 bg-muted bg-opacity-30 rounded-lg p-4">
              {Object.entries(extraction.extractedData).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start pb-3 border-b border-border last:border-b-0">
                  <span className="text-sm text-muted-foreground capitalize font-medium">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="text-sm text-foreground font-mono text-right max-w-xs">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors font-medium">
              Download
            </button>
            <button className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium">
              Export as JSON
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
