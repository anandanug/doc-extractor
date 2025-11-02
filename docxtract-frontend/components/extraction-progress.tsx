"use client"

interface ExtractionProgressProps {
  progress: number
}

export function ExtractionProgress({ progress }: ExtractionProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-foreground">Extracting data...</p>
        <p className="text-sm font-semibold text-primary">{Math.round(progress)}%</p>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
