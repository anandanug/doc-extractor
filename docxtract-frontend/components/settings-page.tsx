"use client"

import { useState, useEffect } from "react"
import { getUserPreferences, updateUserPreferences, type UserPreferences } from "@/lib/user-preferences"
import { AccountSettings } from "./account-settings"
import { NotificationSettings } from "./notification-settings"
import { SecuritySettings } from "./security-settings"

export function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)

  useEffect(() => {
    const loaded = getUserPreferences()
    setPreferences(loaded)
  }, [])

  const handleUpdatePreferences = (updates: Partial<UserPreferences>) => {
    const updated = updateUserPreferences(updates)
    setPreferences(updated)
  }

  if (!preferences) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6 max-w-2xl">
        <AccountSettings preferences={preferences} onUpdate={handleUpdatePreferences} />
        <NotificationSettings preferences={preferences} onUpdate={handleUpdatePreferences} />
        <SecuritySettings preferences={preferences} onUpdate={handleUpdatePreferences} />

        {/* Danger Zone */}
        <div className="bg-destructive bg-opacity-10 border-2 border-destructive border-opacity-30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 border border-destructive rounded-lg text-destructive hover:bg-destructive hover:bg-opacity-10 transition-colors font-medium text-left">
              Clear All Extraction History
            </button>
            <button className="w-full px-4 py-3 border border-destructive rounded-lg text-destructive hover:bg-destructive hover:bg-opacity-10 transition-colors font-medium text-left">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
