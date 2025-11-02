"use client"

interface DocumentTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const documentTypes = [
  { id: "invoice", label: "Invoice" },
  { id: "receipt", label: "Receipt" },
  { id: "contract", label: "Contract" },
  { id: "bank-statement", label: "Bank Statement" },
  { id: "other", label: "Other" },
]

export function DocumentTypeSelector({ value, onChange, disabled = false }: DocumentTypeSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {documentTypes.map((type) => (
        <option key={type.id} value={type.id}>
          {type.label}
        </option>
      ))}
    </select>
  )
}
