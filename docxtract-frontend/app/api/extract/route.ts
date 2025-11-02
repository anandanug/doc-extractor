import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // In production, this would call an AI service like Claude, GPT, or Grok
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock extraction results based on document type
    const mockResults = {
      invoice: {
        invoiceNumber: "INV-2024-001",
        date: "2024-01-15",
        dueDate: "2024-02-15",
        amount: "$5,432.50",
        vendor: "Acme Corp",
        items: [
          {
            nomor: "1",
            namaProduk: "Professional Services",
            jumlah: 40,
            harga: "$150.00",
            total: "$6,000.00",
          },
          {
            nomor: "2",
            namaProduk: "Software License",
            jumlah: 5,
            harga: "$200.00",
            total: "$1,000.00",
          },
          {
            nomor: "3",
            namaProduk: "Support & Maintenance",
            jumlah: 1,
            harga: "$500.00",
            total: "$500.00",
          },
        ],
      },
      receipt: {
        merchant: "Coffee Shop Co",
        date: "2024-01-15",
        time: "10:30 AM",
        amount: "$12.50",
        itemCount: 2,
        paymentMethod: "Credit Card",
        items: [
          {
            nomor: "1",
            namaProduk: "Espresso",
            jumlah: 2,
            harga: "$5.00",
            total: "$10.00",
          },
          {
            nomor: "2",
            namaProduk: "Pastry",
            jumlah: 1,
            harga: "$2.50",
            total: "$2.50",
          },
        ],
      },
      contract: {
        title: "Service Agreement",
        startDate: "2024-02-01",
        endDate: "2025-01-31",
        parties: 2,
        termClauses: 5,
      },
      "bank-statement": {
        bank: "First National Bank",
        accountNumber: "****5678",
        period: "January 2024",
        openingBalance: "$10,000.00",
        closingBalance: "$12,500.00",
        transactions: 12,
      },
      other: {
        content: "Document processed",
        pages: 1,
        language: "English",
      },
    }

    const result = mockResults[documentType as keyof typeof mockResults] || mockResults.other

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      documentType,
      extractedData: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Extraction failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
