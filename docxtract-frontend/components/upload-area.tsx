"use client"

import type React from "react"

import { Cloud, CloudDownload, Upload } from "lucide-react"
import { useRef } from "react"

interface UploadAreaProps {
  onFileUpload: (file: File) => void
  uploadedFile: File | null
}

export function UploadArea({ onFileUpload, uploadedFile }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("bg-accent", "bg-opacity-10", "border-accent")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-accent", "bg-opacity-10", "border-accent")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("bg-accent", "bg-opacity-10", "border-accent")

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileUpload(files[0])
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer bg-primary-foreground text-sidebar-border ${
        uploadedFile ? "border-primary bg-primary bg-opacity-5" : "border-border hover:border-accent"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
      />

      <div className="flex flex-col items-center gap-4">
      <CloudDownload className="w-16 h-16 bg-accent text-accent-foreground rounded-full p-2 transition-colors" />

        {uploadedFile ? (
          <div>
            <p className="font-semibold text-foreground">File berhasil diunggah!</p>
            <p className="text-sm text-muted-foreground">Klik atau seret file lain untuk menggantinya.</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-foreground mb-1">Seret dokumen Anda ke sini atau klik untuk mengunggah.</p>
            <p className="text-sm text-muted-foreground">Format yang didukung: PDF, PNG, JPG.</p>
          </div>
        )}

        <button
          onClick={() => inputRef.current?.click()}
          className="mt-4 px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          Browse Files
        </button>
      </div>
    </div>
  )
}
