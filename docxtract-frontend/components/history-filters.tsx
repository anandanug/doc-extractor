"use client"

import { Search } from "lucide-react"

interface HistoryFiltersProps {
  onSearch: (query: string) => void
  onTypeFilter: (type: string) => void
  selectedType: string
}

export function HistoryFilters({ onSearch, onTypeFilter, selectedType }: HistoryFiltersProps) {
  const documentTypes = [
    { id: "all", label: "All Types" },
    { id: "invoice", label: "Invoice" },
    { id: "receipt", label: "Receipt" },
    { id: "contract", label: "Contract" },
    { id: "bank-statement", label: "Bank Statement" },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama file atau jenis dokumen..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Filter berdasarkan jenis</label>
        <div className="flex flex-wrap gap-2">
          {documentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onTypeFilter(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-opacity-80"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
