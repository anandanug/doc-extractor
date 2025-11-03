"use client"

import { useState } from "react"
import { ChevronDown, AlertCircle, Trash2, Plus } from "lucide-react"

interface InvoiceItem {
  number?: string | null
  prod_number?: string | null
  description?: string | null
  quantity?: string | null
  hs_code?: string | null
  uom?: string | null
  origin?: string | null
  vendor_name?: string | null
  vendor_number?: string | null
  unit_price?: string | null
  currency?: string | null
}

interface InvoiceData {
  seller_name?: string | null
  seller_address?: string | null
  seller_country?: string | null
  seller_phone?: string | null
  buyer_name?: string | null
  buyer_address?: string | null
  buyer_country?: string | null
  buyer_phone?: string | null
  ship_to?: string | null
  invoice_number?: string | null
  invoice_date?: string | null
  payment_terms?: string | null
  inco_terms?: string | null
  freight_terms?: string | null
  origin?: string | null
  ultimate_dest?: string | null
  tax_id?: string | null
  items?: InvoiceItem[] | null
}

interface ExtractedDataPanelInvoiceProps {
  data: InvoiceData
  fileName: string
  onFieldChange?: (fieldName: string, value: string) => void
  onHighlightField?: (fieldName: string) => void
}

export function ExtractedDataPanelInvoice({ 
  data, 
  fileName, 
  onFieldChange, 
  onHighlightField 
}: ExtractedDataPanelInvoiceProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["seller", "buyer", "invoice", "items"]))
  const [editedData, setEditedData] = useState<InvoiceData>(data)

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleFieldChange = (fieldName: keyof InvoiceData, value: string) => {
    const updated = { ...editedData, [fieldName]: value }
    setEditedData(updated)
    onFieldChange?.(fieldName, value)
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string) => {
    const items = [...(editedData.items || [])]
    items[index] = { ...items[index], [field]: value }
    const updated = { ...editedData, items }
    setEditedData(updated)
    onFieldChange?.(`items.${index}.${field}`, value)
  }

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      number: "",
      prod_number: "",
      description: "",
      quantity: "",
      unit_price: "",
      currency: "USD",
      uom: "",
    }
    const items = [...(editedData.items || []), newItem]
    const updated = { ...editedData, items }
    setEditedData(updated)
  }

  const handleDeleteItem = (index: number) => {
    const items = editedData.items?.filter((_, i) => i !== index) || []
    const updated = { ...editedData, items }
    setEditedData(updated)
  }

  const items = editedData.items || []
  const hasItems = items.length > 0

  // Helper function to calculate total price (quantity * unit_price)
  const calculateTotalPrice = (quantity: string | null | undefined, unitPrice: string | null | undefined): string => {
    if (!quantity || !unitPrice) return ""

    try {
      // Remove common formatting characters (commas, spaces) and parse
      const qtyStr = quantity.toString().replace(/,/g, "").replace(/\s/g, "").trim()
      const priceStr = unitPrice.toString().replace(/,/g, "").replace(/\s/g, "").trim()

      const qty = parseFloat(qtyStr)
      const price = parseFloat(priceStr)

      if (isNaN(qty) || isNaN(price)) return ""

      const total = qty * price
      // Format with commas for thousands separator
      return total.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } catch (error) {
      return ""
    }
  }

  const renderField = (label: string, fieldName: keyof InvoiceData, value: string | null | undefined) => {
    return (
      <div key={fieldName} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-foreground">
            {label}
          </label>
        </div>
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
        <h2 className="text-lg font-semibold text-foreground">Data Invoice yang Diekstrak</h2>
        <p className="text-xs text-muted-foreground">{fileName}</p>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-auto">
        {/* Seller Information Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("seller")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold text-sm text-foreground">Informasi Penjual</h3>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                expandedSections.has("seller") ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.has("seller") && (
            <div className="px-4 py-3 space-y-4 bg-background bg-opacity-30">
              {renderField("Nama Penjual", "seller_name", editedData.seller_name)}
              {renderField("Alamat Penjual", "seller_address", editedData.seller_address)}
              {renderField("Negara Penjual", "seller_country", editedData.seller_country)}
              {renderField("Telepon Penjual", "seller_phone", editedData.seller_phone)}
            </div>
          )}
        </div>

        {/* Buyer Information Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("buyer")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold text-sm text-foreground">Informasi Pembeli</h3>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                expandedSections.has("buyer") ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.has("buyer") && (
            <div className="px-4 py-3 space-y-4 bg-background bg-opacity-30">
              {renderField("Nama Pembeli", "buyer_name", editedData.buyer_name)}
              {renderField("Alamat Pembeli", "buyer_address", editedData.buyer_address)}
              {renderField("Negara Pembeli", "buyer_country", editedData.buyer_country)}
              {renderField("Telepon Pembeli", "buyer_phone", editedData.buyer_phone)}
            </div>
          )}
        </div>

        {/* Invoice Details Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("invoice")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold text-sm text-foreground">Detail Invoice</h3>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                expandedSections.has("invoice") ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.has("invoice") && (
            <div className="px-4 py-3 space-y-4 bg-background bg-opacity-30">
              {renderField("Nomor Invoice", "invoice_number", editedData.invoice_number)}
              {renderField("Tanggal Invoice", "invoice_date", editedData.invoice_date)}
              {renderField("Syarat Pembayaran", "payment_terms", editedData.payment_terms)}
              {renderField("Syarat INCO", "inco_terms", editedData.inco_terms)}
              {renderField("Syarat Angkutan", "freight_terms", editedData.freight_terms)}
              {renderField("Kirim Ke", "ship_to", editedData.ship_to)}
              {/* {renderField("Asal", "origin", editedData.origin)}
              {renderField("Tujuan Akhir", "ultimate_dest", editedData.ultimate_dest)}
              {renderField("NPWP", "tax_id", editedData.tax_id)} */}
            </div>
          )}
        </div>

        {/* Items Section */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("items")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold text-sm text-foreground">
              Baris Item {hasItems && `(${items.length})`}
            </h3>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                expandedSections.has("items") ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSections.has("items") && (
            <div className="px-4 py-3 space-y-4 bg-background bg-opacity-30">
              {hasItems ? (
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-border rounded-lg space-y-3 hover:bg-background hover:bg-opacity-5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Item #{idx + 1}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteItem(idx)}
                          className="text-destructive hover:bg-destructive hover:bg-opacity-10 p-1 rounded transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Nomor</label>
                          <input
                            type="text"
                            value={idx + 1}
                            readOnly
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground bg-muted cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Nomor Produk</label>
                          <input
                            type="text"
                            value={item.prod_number || ""}
                            onChange={(e) => handleItemChange(idx, "prod_number", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="col-span-2 space-y-1">
                          <label className="text-xs font-medium text-foreground">Deskripsi</label>
                          <input
                            type="text"
                            value={item.description || ""}
                            onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Jumlah</label>
                          <input
                            type="text"
                            value={item.quantity || ""}
                            onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground text-right focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Satuan</label>
                          <input
                            type="text"
                            value={item.uom || ""}
                            onChange={(e) => handleItemChange(idx, "uom", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Harga Satuan</label>
                          <input
                            type="text"
                            value={item.unit_price || ""}
                            onChange={(e) => handleItemChange(idx, "unit_price", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground text-right focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Mata Uang</label>
                          <input
                            type="text"
                            value={item.currency || ""}
                            onChange={(e) => handleItemChange(idx, "currency", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="col-span-2 space-y-1">
                          <label className="text-xs font-medium text-foreground">Total Harga</label>
                          <input
                            type="text"
                            value={calculateTotalPrice(item.quantity, item.unit_price)}
                            readOnly
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground text-right bg-muted cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                          />
                        </div>

                        {/* <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Kode HS</label>
                          <input
                            type="text"
                            value={item.hs_code || ""}
                            onChange={(e) => handleItemChange(idx, "hs_code", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Asal</label>
                          <input
                            type="text"
                            value={item.origin || ""}
                            onChange={(e) => handleItemChange(idx, "origin", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Nama Vendor</label>
                          <input
                            type="text"
                            value={item.vendor_name || ""}
                            onChange={(e) => handleItemChange(idx, "vendor_name", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-foreground">Nomor Vendor</label>
                          <input
                            type="text"
                            value={item.vendor_number || ""}
                            onChange={(e) => handleItemChange(idx, "vendor_number", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">Tidak ada item ditemukan</p>
              )}
              <button 
                onClick={handleAddItem}
                className="w-full text-sm py-2 px-3 border border-dashed border-border rounded-md text-primary hover:bg-primary hover:bg-opacity-5 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Item
              </button>
            </div>
          )}
        </div>

        {/* Confidence Info */}
        <div className="p-4 space-y-2 bg-accent bg-opacity-5 border-t border-border">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Tinjau dan edit data yang diekstrak sesuai kebutuhan. Semua field dapat diedit.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

