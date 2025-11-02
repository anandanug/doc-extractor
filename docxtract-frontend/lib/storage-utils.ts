export interface StoredExtraction {
  id: string
  filename: string
  type: string
  date: string
  size: string
  status: "completed" | "processing" | "error"
  extractedData: Record<string, any>
  timestamp: number
}

const STORAGE_KEY = "extraction_history"

export function saveExtraction(extraction: Omit<StoredExtraction, "id">): StoredExtraction {
  const id = generateId()
  const stored: StoredExtraction = { ...extraction, id }

  const history = getExtractionHistory()
  history.unshift(stored)

  // Keep only last 50 extractions
  if (history.length > 50) {
    history.pop()
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return stored
}

export function getExtractionHistory(): StoredExtraction[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function deleteExtraction(id: string): void {
  const history = getExtractionHistory()
  const filtered = history.filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function searchExtractions(query: string, type?: string): StoredExtraction[] {
  let history = getExtractionHistory()

  if (type && type !== "all") {
    history = history.filter((item) => item.type.toLowerCase() === type.toLowerCase())
  }

  if (query) {
    history = history.filter(
      (item) =>
        item.filename.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return history
}

function generateId(): string {
  return `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
