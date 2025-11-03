"use client"

import { useState } from "react"
import { ChevronDown, AlertCircle } from "lucide-react"

interface ReceiptItem {
  name?: string | null
  quantity?: string | null
  price?: string | null
  total?: string | null
}

interface ReceiptData {
  merchant?: string | null
  merchantAddress?: string | null
  date?: string | null
  time?: string | null
  totalAmount?: string | null
  taxAmount?: string | null
  subtotal?: string | null
  paymentMethod?: string | null
  cardNumber?: string | null
  receiptNumber?: string | null
  items?: ReceiptItem[] | null
}

interface ExtractedDataPanelReceiptProps {
  data: ReceiptData
  fileName: string
  onFieldChange?: (fieldName: string, value: string) => void
  onHighlightField?: (fieldName: string) => void
}

export function ExtractedDataPanelReceipt({ 
  data, 
  fileName, 
  onFieldChange, 
  onHighlightField 
}: ExtractedDataPanelReceiptProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["merchant", "payment", "items"]))
  const [editedData, setEditedData] = useState<ReceiptData>(data)

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleFieldChange = (fieldName: keyof ReceiptData, value: string) => {
    const updated = { ...editedData, [fieldName]: value }
    setEditedData(updated)
    onFieldChange?.(fieldName, value)
  }

  const items = editedData.items || []
  const hasItems = items.length > 0

  const renderField = (label: string, fieldName: keyof ReceiptData, value: string | null | undefined) => {
    return (
      <div key={fieldName} className="space-y-2">
        <label className="text-xs font-medium text-foreground">{label}</label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          onFocus={() => onHighlightField?.(String(fieldName))}
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all"
        />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Extracted Receipt Data</h2>
        <p className="text-xs text-muted-foreground">{fileName}</p>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-auto">
        {/* Merchant Information Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("merchant")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold text-sm text-foreground">Merchant Information</h3>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                expandedSections.has("merchant") ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.has("merchant") && (
            <div className="px-4 py-3 space-y-4 bg-background bg-opacity-30">
              {renderField("Merchant Name", "merchant", editedData.merchant)}
              {renderField("Merchant Address", "merchantAddress", editedData.merchantAddress)}
              {renderField("Receipt Number", "receiptNumber", editedData.receiptNumber)}
              {renderField("Date", "date", editedData.date)}
              {renderField("Time", "time", editedData.time)}
            </div>
          )}
        </div>

        {/* Payment Information Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("payment")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold text-sm text-foreground">Payment Information</h3>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                expandedSections.has("payment") ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.has("payment") && (
            <div className="px-4 py-3 space-y-4 bg-background bg-opacity-30">
              {renderField("Subtotal", "subtotal", editedData.subtotal)}
              {renderField("Tax Amount", "taxAmount", editedData.taxAmount)}
              {renderField("Total Amount", "totalAmount", editedData.totalAmount)}
              {renderField("Payment Method", "paymentMethod", editedData.paymentMethod)}
              {renderField("Card Number", "cardNumber", editedData.cardNumber)}
            </div>
          )}
        </div>

        {/* Items Section */}
        {hasItems && (
          <div className="border-b border-border">
            <button
              onClick={() => toggleSection("items")}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold text-sm text-foreground">Items ({items.length})</h3>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  expandedSections.has("items") ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.has("items") && (
              <div className="px-4 py-3 space-y-4 bg-background bg-opacity-30">
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-border rounded-lg space-y-3 hover:bg-background hover:bg-opacity-5 transition-colors"
                    >
                      <p className="text-xs font-medium text-muted-foreground mb-2">Item #{idx + 1}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1">
                          <label className="text-xs font-medium text-foreground">Name</label>
                          <input
                            type="text"
                            value={item.name || ""}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            readOnly
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Quantity</label>
                          <input
                            type="text"
                            value={item.quantity || ""}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            readOnly
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Price</label>
                          <input
                            type="text"
                            value={item.price || ""}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground text-right focus:outline-none focus:ring-1 focus:ring-primary"
                            readOnly
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="text-xs font-medium text-foreground">Total</label>
                          <input
                            type="text"
                            value={item.total || ""}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground text-right focus:outline-none focus:ring-1 focus:ring-primary"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confidence Info */}
        <div className="p-4 space-y-2 bg-accent bg-opacity-5 border-t border-border">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Review and edit the extracted data as needed. All fields are editable.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

