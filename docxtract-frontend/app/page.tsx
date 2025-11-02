"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ExtractionPage } from "@/components/extraction-page"
import { HistoryPage } from "@/components/history-page"
import { TemplatesPage } from "@/components/templates-page"
import { SettingsPage } from "@/components/settings-page"

type PageType = "extraction" | "history" | "templates" | "settings"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("extraction")

  const renderPage = () => {
    switch (currentPage) {
      case "history":
        return <HistoryPage />
      case "templates":
        return <TemplatesPage />
      case "settings":
        return <SettingsPage />
      case "extraction":
      default:
        return <ExtractionPage />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  )
}
