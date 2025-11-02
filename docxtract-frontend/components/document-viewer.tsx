"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"

interface DocumentViewerProps {
  fileName: string
  fileType?: string
  highlightedText?: string
}

export function DocumentViewer({ fileName, fileType = "PDF", highlightedText }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5 // Simulate multi-page document

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      if (direction === "in") return Math.min(prev + 10, 200)
      return Math.max(prev - 10, 50)
    })
  }

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="border-b border-border p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{fileName}</p>
          <p className="text-xs text-muted-foreground">
            {fileType} • {currentPage} of {totalPages}
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleZoom("out")}
            className="p-2 hover:bg-accent hover:bg-opacity-10 rounded-md transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-xs font-medium text-muted-foreground w-12 text-center">{zoom}%</span>
          <button
            onClick={() => handleZoom("in")}
            className="p-2 hover:bg-accent hover:bg-opacity-10 rounded-md transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Document Preview Area */}
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-background bg-opacity-50">
        <div
          className={`bg-white rounded-lg shadow-lg border border-border transition-transform ${
            highlightedText ? "ring-2 ring-primary ring-opacity-50" : ""
          }`}
          style={{
            width: `${300 * (zoom / 100)}px`,
            aspectRatio: "8.5 / 11",
          }}
        >
          {/* Simulated Document Content */}
          <div className="w-full h-full p-6 flex flex-col justify-start overflow-hidden text-sm text-foreground bg-white rounded-lg">
            <div className="font-bold text-lg mb-4">INVOICE #INV-2024-001</div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold">Vendor:</span> Acme Corporation
              </div>
              <div>
                <span className="font-semibold">Date:</span> 2024-01-15
              </div>
              <div>
                <span className="font-semibold">Amount:</span> $1,250.00
              </div>
              <div className="mt-4">
                <div className="font-semibold text-xs mb-2">Items:</div>
                <div className="space-y-1">
                  <div>• Product A: $500</div>
                  <div>• Product B: $750</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border p-4 flex items-center justify-between bg-background">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 hover:bg-accent hover:bg-opacity-10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-xs font-medium text-muted-foreground">
          {currentPage}/{totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-accent hover:bg-opacity-10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
