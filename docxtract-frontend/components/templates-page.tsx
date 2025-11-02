"use client"

import { Plus, Edit2, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import {
  getTemplates,
  saveTemplate,
  updateTemplate,
  deleteTemplate,
  type ExtractionTemplate,
} from "@/lib/templates-utils"
import { TemplateFormModal } from "./template-form-modal"

export function TemplatesPage() {
  const [templates, setTemplates] = useState<ExtractionTemplate[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ExtractionTemplate | null>(null)

  useEffect(() => {
    const loadedTemplates = getTemplates()
    setTemplates(loadedTemplates)
  }, [])

  const handleOpenModal = (template?: ExtractionTemplate) => {
    if (template) {
      setEditingTemplate(template)
    } else {
      setEditingTemplate(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTemplate(null)
  }

  const handleSaveTemplate = (templateData: any) => {
    if (editingTemplate) {
      const updated = updateTemplate(editingTemplate.id, templateData)
      if (updated) {
        setTemplates(templates.map((t) => (t.id === updated.id ? updated : t)))
      }
    } else {
      const created = saveTemplate(templateData)
      setTemplates([created, ...templates])
    }
    handleCloseModal()
  }

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      deleteTemplate(id)
      setTemplates(templates.filter((t) => t.id !== id))
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Templates</h1>
          <p className="text-muted-foreground">Create and manage extraction templates for your documents</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{template.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4 pb-4 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground capitalize">{template.documentType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fields:</span>
                <span className="font-medium text-foreground">{template.fields.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Updated:</span>
                <span className="font-medium text-foreground">{template.updatedDate}</span>
              </div>
            </div>

            {/* Field List */}
            <div className="mb-4 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Fields:</p>
              <div className="flex flex-wrap gap-1">
                {template.fields.map((field) => (
                  <span key={field.id} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                    {field.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenModal(template)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-accent bg-opacity-10 text-accent hover:bg-opacity-20 transition-colors font-medium text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <div className="text-center py-12 bg-muted bg-opacity-30 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No templates created yet</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Template
          </button>
        </div>
      )}

      {/* Form Modal */}
      <TemplateFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTemplate}
        initialTemplate={editingTemplate || undefined}
      />
    </div>
  )
}
