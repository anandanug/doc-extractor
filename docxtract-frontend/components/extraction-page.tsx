"use client"

import { useState } from "react"
import { UploadArea } from "./upload-area"
import { DocumentTypeSelector } from "./document-type-selector"
import { ExtractionProgress } from "./extraction-progress"
import { ExtractionResults } from "./extraction-results"
import { ExtractionResultView } from "./extraction-result-view"
import { validateFile, formatFileSize } from "@/lib/file-utils"

export function ExtractionPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("invoice")
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<Record<string, any> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showResultView, setShowResultView] = useState(false)

  const handleFileUpload = (file: File) => {
    const validation = validateFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }
    setError(null)
    setUploadedFile(file)
    setExtractedData(null)
  }

  const handleStartExtraction = async () => {
    if (!uploadedFile) return

    setIsExtracting(true)
    setExtractionProgress(0)
    setError(null)

    const progressInterval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 20
      })
    }, 300)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)
      formData.append("documentType", documentType)

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Extraction failed")
      }

      const result = await response.json()
      setExtractedData(result.extractedData)
      setExtractionProgress(100)
      setShowResultView(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during extraction")
    } finally {
      clearInterval(progressInterval)
      setIsExtracting(false)
    }
  }

  const handleCancelResult = () => {
    setShowResultView(false)
    setExtractedData(null)
    setUploadedFile(null)
  }

  if (showResultView && extractedData && uploadedFile) {
    return (
      <ExtractionResultView
        fileName={uploadedFile.name}
        file={uploadedFile}
        fileType="PDF"
        documentType={documentType}
        extractedData={extractedData}
        onCancel={handleCancelResult}
        onRerun={() => {
          setShowResultView(false)
          setExtractedData(null)
        }}
        onSave={() => {
          // Save to history logic
          console.log("Saving extraction results")
        }}
      />
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dokumen Ekstraksi</h1>
        <p className="text-muted-foreground">Unggah dokumen Anda, dan biarkan AI mengekstrak datanya secara otomatis.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive bg-opacity-10 border border-destructive border-opacity-30 rounded-lg p-4 text-destructive">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-8">
            <UploadArea onFileUpload={handleFileUpload} uploadedFile={uploadedFile} />
          </div>

          {extractedData && !isExtracting && (
            <ExtractionResults data={extractedData} fileName={uploadedFile?.name || "Document"} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Type Selection */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Tipe Dokumen</h2>
            <DocumentTypeSelector value={documentType} onChange={setDocumentType} disabled={isExtracting} />
          </div>

          {/* Supported Formats */}
          

          {/* Action Button */}
          <button
            onClick={handleStartExtraction}
            disabled={!uploadedFile || isExtracting}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              !uploadedFile || isExtracting
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-[#418ae4] text-white hover:bg-[#418ae4]/90"
            }`}
          >
            {isExtracting ? "Mengekstrak..." : "Mulai Ekstraksi"}
          </button>

          {/* Uploaded File Info and Progress */}
          {uploadedFile && (
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileIcon className="w-12 h-12 text-accent bg-accent text-accent-foreground rounded-full p-2 transition-colors" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                </div>
              </div>

              {isExtracting && <ExtractionProgress progress={extractionProgress} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FileIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  )
}
