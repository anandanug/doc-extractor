export interface ExtractionTemplate {
  id: string
  name: string
  description: string
  fields: TemplateField[]
  documentType: string
  createdDate: string
  updatedDate: string
}

export interface TemplateField {
  id: string
  name: string
  label: string
  type: "text" | "number" | "date" | "email" | "phone"
  required: boolean
  description?: string
}

const TEMPLATES_KEY = "extraction_templates"

export function getTemplates(): ExtractionTemplate[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(TEMPLATES_KEY)
  return stored ? JSON.parse(stored) : getDefaultTemplates()
}

export function saveTemplate(
  template: Omit<ExtractionTemplate, "id" | "createdDate" | "updatedDate">,
): ExtractionTemplate {
  const id = `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const now = new Date().toISOString().split("T")[0]

  const newTemplate: ExtractionTemplate = {
    ...template,
    id,
    createdDate: now,
    updatedDate: now,
  }

  const templates = getTemplates()
  templates.unshift(newTemplate)
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))

  return newTemplate
}

export function updateTemplate(
  id: string,
  updates: Partial<Omit<ExtractionTemplate, "id" | "createdDate">>,
): ExtractionTemplate | null {
  const templates = getTemplates()
  const index = templates.findIndex((t) => t.id === id)

  if (index === -1) return null

  const now = new Date().toISOString().split("T")[0]
  templates[index] = {
    ...templates[index],
    ...updates,
    updatedDate: now,
  }

  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
  return templates[index]
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates()
  const filtered = templates.filter((t) => t.id !== id)
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered))
}

function getDefaultTemplates(): ExtractionTemplate[] {
  return [
    {
      id: "tpl_default_invoice",
      name: "Standard Invoice",
      description: "Template for standard invoices",
      documentType: "invoice",
      createdDate: "2024-01-01",
      updatedDate: "2024-01-01",
      fields: [
        { id: "f1", name: "invoiceNumber", label: "Invoice Number", type: "text", required: true },
        { id: "f2", name: "date", label: "Invoice Date", type: "date", required: true },
        { id: "f3", name: "dueDate", label: "Due Date", type: "date", required: true },
        { id: "f4", name: "vendor", label: "Vendor Name", type: "text", required: true },
        { id: "f5", name: "amount", label: "Total Amount", type: "number", required: true },
      ],
    },
    {
      id: "tpl_default_receipt",
      name: "Receipt",
      description: "Template for receipt extraction",
      documentType: "receipt",
      createdDate: "2024-01-01",
      updatedDate: "2024-01-01",
      fields: [
        { id: "f1", name: "merchant", label: "Merchant Name", type: "text", required: true },
        { id: "f2", name: "date", label: "Date", type: "date", required: true },
        { id: "f3", name: "amount", label: "Total Amount", type: "number", required: true },
        { id: "f4", name: "paymentMethod", label: "Payment Method", type: "text", required: false },
      ],
    },
  ]
}
