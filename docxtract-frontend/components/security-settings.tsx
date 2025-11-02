"use client"

import { Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import type { UserPreferences } from "@/lib/user-preferences"

interface SecuritySettingsProps {
  preferences: UserPreferences
  onUpdate: (updates: Partial<UserPreferences>) => void
}

export function SecuritySettings({ preferences, onUpdate }: SecuritySettingsProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false)

  const handleToggleTwoFactor = () => {
    onUpdate({ twoFactorEnabled: !preferences.twoFactorEnabled })
    setTwoFactorModalOpen(false)
  }

  const generateApiKey = () => {
    const newKey = `sk_${Date.now()}_${Math.random().toString(36).substr(2, 32)}`
    onUpdate({ apiKey: newKey })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-destructive bg-opacity-10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Security</h2>
      </div>

      <div className="space-y-4">
        {/* Password */}
        <button className="w-full px-4 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium text-left">
          Change Password
        </button>

        {/* Two-Factor Authentication */}
        <div className="bg-muted bg-opacity-30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground mt-1">
                {preferences.twoFactorEnabled ? "Enabled" : "Disabled"} - Add an extra layer of security
              </p>
            </div>
            <button
              onClick={() => setTwoFactorModalOpen(true)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                preferences.twoFactorEnabled
                  ? "bg-destructive text-destructive-foreground hover:bg-opacity-90"
                  : "bg-primary text-primary-foreground hover:bg-opacity-90"
              }`}
            >
              {preferences.twoFactorEnabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        {/* API Key */}
        <div className="bg-muted bg-opacity-30 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">API Key</p>
            <button
              onClick={generateApiKey}
              className="text-xs px-3 py-1 bg-accent text-accent-foreground rounded hover:bg-opacity-90 transition-colors font-medium"
            >
              Generate New
            </button>
          </div>

          {preferences.apiKey && (
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={preferences.apiKey}
                readOnly
                className="w-full pr-10 pl-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none font-mono text-sm"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Use this key to authenticate API requests</p>
        </div>
      </div>

      {/* 2FA Modal */}
      {twoFactorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-foreground mb-2">
              {preferences.twoFactorEnabled ? "Disable" : "Enable"} Two-Factor Authentication?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {preferences.twoFactorEnabled
                ? "This will reduce your account security. Are you sure?"
                : "You will need an authenticator app to verify your identity."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setTwoFactorModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleTwoFactor}
                className={`flex-1 px-4 py-2 rounded-lg text-primary-foreground transition-colors font-medium ${
                  preferences.twoFactorEnabled ? "bg-destructive hover:bg-opacity-90" : "bg-primary hover:bg-opacity-90"
                }`}
              >
                {preferences.twoFactorEnabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
