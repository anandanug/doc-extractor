"use client"

import { X, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import type { ExtractionTemplate, TemplateField } from "@/lib/templates-utils"

interface TemplateFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (template: Omit<ExtractionTemplate, "id" | "createdDate" | "updatedDate">) => void
  initialTemplate?: ExtractionTemplate
}

export function TemplateFormModal({ isOpen, onClose, onSave, initialTemplate }: TemplateFormModalProps) {
  const [name, setName] = useState(initialTemplate?.name || "")
  const [description, setDescription] = useState(initialTemplate?.description || "")
  const [documentType, setDocumentType] = useState(initialTemplate?.documentType || "invoice")
  const [fields, setFields] = useState<TemplateField[]>(initialTemplate?.fields || [])

  const handleAddField = () => {
    const newField: TemplateField = {
      id: `f_${Date.now()}`,
      name: "",
      label: "",
      type: "text",
      required: false,
    }
    setFields([...fields, newField])
  }

  const handleUpdateField = (id: string, updates: Partial<TemplateField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
  }

  const handleSubmit = () => {
    if (!name || !description || fields.length === 0) {
      alert("Please fill in all required fields and add at least one field")
      return
    }

    onSave({
      name,
      description,
      documentType,
      fields,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">
            {initialTemplate ? "Edit Template" : "Create New Template"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Template Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Custom Invoice Template"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this template is used for..."
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="invoice">Invoice</option>
                <option value="receipt">Receipt</option>
                <option value="contract">Contract</option>
                <option value="bank-statement">Bank Statement</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Extraction Fields</h3>
              <button
                onClick={handleAddField}
                className="flex items-center gap-2 px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-muted bg-opacity-30 border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">Field {index + 1}</span>
                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="p-2 hover:bg-destructive hover:bg-opacity-10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => handleUpdateField(field.id, { name: e.target.value })}
                      placeholder="Field name (e.g., invoiceNumber)"
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                      placeholder="Display label"
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={field.type}
                      onChange={(e) => handleUpdateField(field.id, { type: e.target.value as any })}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>

                    <label className="flex items-center gap-2 px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                        className="rounded border-border"
                      />
                      <span className="text-foreground">Required</span>
                    </label>
                  </div>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-8 bg-muted bg-opacity-30 rounded-lg border border-dashed border-border">
                  <p className="text-muted-foreground text-sm">No fields added yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Click "Add Field" to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 bg-muted bg-opacity-20 sticky bottom-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors font-medium"
          >
            {initialTemplate ? "Update Template" : "Create Template"}
          </button>
        </div>
      </div>
    </div>
  )
}
