"use client"

import { CloudDownloadIcon, FileText, History, Settings, Zap } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: "extraction" | "history" | "templates" | "settings") => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const navItems = [
    { id: "extraction", label: "Extraction", icon: CloudDownloadIcon },
    { id: "history", label: "History", icon: History },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-lg text-sidebar-foreground">AI Extract</div>
            <div className="text-xs text-sidebar-foreground">Data Extraction</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:bg-opacity-20"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-opacity-10 rounded-lg p-3 bg-background">
          <p className="text-xs text-sidebar-foreground">
            <span className="font-semibold">v1.0.0</span> - Processing documents accurately
          </p>
        </div>
      </div>
    </aside>
  )
}
