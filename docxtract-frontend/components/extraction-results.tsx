"use client"

interface ExtractionResultsProps {
  data: Record<string, any>
  fileName: string
}

export function ExtractionResults({ data, fileName }: ExtractionResultsProps) {
  return (
    <div className="bg-accent bg-opacity-5 border border-accent border-opacity-20 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Extraction Results</h3>
        <p className="text-sm text-muted-foreground">{fileName}</p>
      </div>

      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start py-2 border-b border-border last:border-b-0">
            <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
            <span className="text-sm font-medium text-foreground text-right max-w-xs">{String(value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors font-medium text-sm">
          Download Results
        </button>
        <button className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium text-sm">
          Save to History
        </button>
      </div>
    </div>
  )
}
