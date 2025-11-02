"use client"

import { Bell } from "lucide-react"
import type { UserPreferences } from "@/lib/user-preferences"

interface NotificationSettingsProps {
  preferences: UserPreferences
  onUpdate: (updates: Partial<UserPreferences>) => void
}

export function NotificationSettings({ preferences, onUpdate }: NotificationSettingsProps) {
  const notificationOptions = [
    {
      key: "emailNotifications" as const,
      label: "Email Notifications",
      description: "Receive updates about your extractions via email",
    },
    {
      key: "pushNotifications" as const,
      label: "Push Notifications",
      description: "Receive push notifications for important events",
    },
    {
      key: "autoExtract" as const,
      label: "Auto-Extract",
      description: "Automatically extract documents when uploaded",
    },
  ]

  const handleToggle = (key: keyof UserPreferences) => {
    onUpdate({
      [key]: !preferences[key as keyof UserPreferences],
    })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent bg-opacity-10 flex items-center justify-center">
          <Bell className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between p-4 bg-muted bg-opacity-30 rounded-lg">
            <div>
              <p className="font-medium text-foreground">{option.label}</p>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            <button
              onClick={() => handleToggle(option.key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences[option.key as keyof UserPreferences] ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences[option.key as keyof UserPreferences] ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
