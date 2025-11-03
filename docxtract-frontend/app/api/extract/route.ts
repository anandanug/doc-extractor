import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"

// Map document types to backend endpoints
const DOCUMENT_TYPE_TO_ENDPOINT: Record<string, string> = {
  invoice: "/extract/invoice",
  "packing-list": "/extract/packing-list",
  awb: "/extract/awb",
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get the appropriate endpoint for the document type
    const endpoint = DOCUMENT_TYPE_TO_ENDPOINT[documentType] || DOCUMENT_TYPE_TO_ENDPOINT["invoice"]
    const backendUrl = `${BACKEND_URL}${endpoint}`

    // Create FormData for the backend request
    const backendFormData = new FormData()
    backendFormData.append("file", file)

    // Call the Flask backend
    const response = await fetch(backendUrl, {
      method: "POST",
      body: backendFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      return NextResponse.json(
        { error: "Backend extraction failed", details: errorData.error || "Unknown error" },
        { status: response.status },
      )
    }

    const backendResponse = await response.json()

    // Backend returns: { execution_time: number, data: {...} }
    // We need to extract the data field and return it as extractedData
    const extractedData = backendResponse.data || backendResponse

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      documentType,
      extractedData,
      executionTime: backendResponse.execution_time,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Extraction error:", error)
    return NextResponse.json(
      { error: "Extraction failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
