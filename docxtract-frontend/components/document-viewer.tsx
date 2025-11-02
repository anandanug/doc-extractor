"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"

interface DocumentViewerProps {
  fileName: string
  file?: File | null
  fileType?: string
  highlightedText?: string
}

export function DocumentViewer({ fileName, file, fileType, highlightedText }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  // Detect file type from file or prop
  const detectedFileType = useMemo(() => {
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase()
      if (extension === 'pdf') return 'PDF'
      if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension || '')) return 'IMAGE'
      if (extension === 'docx') return 'DOCX'
      if (extension === 'xlsx') return 'XLSX'
    }
    return fileType || "PDF"
  }, [file, fileType])

  // Create object URL from file
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setObjectUrl(url)

      // For PDFs, try to get page count (this is a simplified approach)
      if (detectedFileType === 'PDF') {
        // PDF.js would be needed for accurate page count, but we'll use a default for now
        setTotalPages(1) // Will be updated if we can detect pages
      } else if (detectedFileType === 'IMAGE') {
        setTotalPages(1)
      }

      // Cleanup object URL on unmount or when file changes
      return () => {
        URL.revokeObjectURL(url)
        setObjectUrl(null)
      }
    } else {
      setObjectUrl(null)
      setTotalPages(1)
    }
  }, [file, detectedFileType])

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      if (direction === "in") return Math.min(prev + 10, 200)
      return Math.max(prev - 10, 50)
    })
  }

  const renderDocument = () => {
    // Show loading or placeholder if file exists but objectUrl is not ready yet
    if (file && !objectUrl) {
      return (
        <div className="w-full h-full p-6 flex flex-col items-center justify-center text-sm text-foreground bg-white rounded-lg">
          <div className="text-muted-foreground">Loading document...</div>
        </div>
      )
    }

    // Fallback to dummy content if no file
    if (!objectUrl && !file) {
      return (
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
      )
    }

    // Only render if objectUrl exists
    if (!objectUrl) {
      return null
    }

    if (detectedFileType === 'IMAGE') {
      return (
        <img
          src={objectUrl}
          alt={fileName}
          className="w-full h-full object-contain rounded-lg"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease',
          }}
        />
      )
    }

    if (detectedFileType === 'PDF') {
      return (
        <iframe
          src={objectUrl}
          className="w-full h-full rounded-lg border-0"
          title={fileName}
          style={{
            minHeight: '600px',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease',
          }}
        />
      )
    }

    // For DOCX, XLSX, or other files, show in iframe/object
    return (
      <iframe
        src={objectUrl}
        className="w-full h-full rounded-lg border-0"
        title={fileName}
        style={{
          minHeight: '600px',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
        }}
      />
    )
  }

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="border-b border-border p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{fileName}</p>
          <p className="text-xs text-muted-foreground">
            {detectedFileType} • {totalPages > 1 ? `${currentPage} of ${totalPages}` : 'Document'}
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
          className={`bg-white rounded-lg shadow-lg border border-border ${
            highlightedText ? "ring-2 ring-primary ring-opacity-50" : ""
          }`}
          style={{
            width: detectedFileType === 'IMAGE' ? '800px' : '700px',
            aspectRatio: detectedFileType === 'IMAGE' ? 'auto' : "8.5 / 11",
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderDocument()}
        </div>
      </div>

      {/* Navigation - Only show if multi-page document */}
      {totalPages > 1 && (
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
      )}
    </div>
  )
}
