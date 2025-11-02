"use client"

import { User } from "lucide-react"
import { useState } from "react"
import type { UserPreferences } from "@/lib/user-preferences"

interface AccountSettingsProps {
  preferences: UserPreferences
  onUpdate: (updates: Partial<UserPreferences>) => void
}

export function AccountSettings({ preferences, onUpdate }: AccountSettingsProps) {
  const [fullName, setFullName] = useState(preferences.fullName)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      onUpdate({ fullName })
      setIsSaving(false)
    }, 500)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Account</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
          <input
            type="email"
            value={preferences.email}
            disabled
            className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed focus:outline-none"
          />
          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed directly</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Language</label>
          <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
