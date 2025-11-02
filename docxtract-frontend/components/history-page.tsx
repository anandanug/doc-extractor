"use client"

import { Download, Eye, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { getExtractionHistory, deleteExtraction, searchExtractions, type StoredExtraction } from "@/lib/storage-utils"
import { HistoryFilters } from "./history-filters"
import { ExtractionDetailModal } from "./extraction-detail-modal"

export function HistoryPage() {
  const [records, setRecords] = useState<StoredExtraction[]>([])
  const [filteredRecords, setFilteredRecords] = useState<StoredExtraction[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedExtraction, setSelectedExtraction] = useState<StoredExtraction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const history = getExtractionHistory()
    setRecords(history)
    setFilteredRecords(history)
  }, [])

  useEffect(() => {
    const results = searchExtractions(searchQuery, selectedType === "all" ? undefined : selectedType)
    setFilteredRecords(results)
  }, [searchQuery, selectedType])

  const handleDelete = (id: string) => {
    deleteExtraction(id)
    setRecords(records.filter((r) => r.id !== id))
  }

  const handleViewDetails = (extraction: StoredExtraction) => {
    setSelectedExtraction(extraction)
    setIsModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Extraction History</h1>
        <p className="text-muted-foreground">View and manage all your extracted documents</p>
      </div>

      {/* Filters */}
      <HistoryFilters onSearch={setSearchQuery} onTypeFilter={setSelectedType} selectedType={selectedType} />

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">
            {records.length === 0 ? "No extractions yet" : "No results found"}
          </p>
          <p className="text-sm text-muted-foreground">
            {records.length === 0 ? "Start by uploading a document for extraction" : "Try adjusting your filters"}
          </p>
        </div>
      )}

      {/* History Table */}
      {filteredRecords.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Filename</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Size</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{record.filename}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{record.type}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{record.size}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-accent" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-accent" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <ExtractionDetailModal
        extraction={selectedExtraction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
