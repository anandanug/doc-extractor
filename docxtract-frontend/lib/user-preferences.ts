export interface UserPreferences {
  fullName: string
  email: string
  emailNotifications: boolean
  pushNotifications: boolean
  autoExtract: boolean
  theme: "light" | "dark" | "system"
  language: string
  apiKey?: string
  twoFactorEnabled: boolean
  lastUpdated: string
}

const PREFERENCES_KEY = "user_preferences"
const DEFAULT_PREFERENCES: UserPreferences = {
  fullName: "John Doe",
  email: "user@example.com",
  emailNotifications: true,
  pushNotifications: false,
  autoExtract: true,
  theme: "system",
  language: "en",
  twoFactorEnabled: false,
  lastUpdated: new Date().toISOString(),
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES

  const stored = localStorage.getItem(PREFERENCES_KEY)
  return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES
}

export function updateUserPreferences(updates: Partial<UserPreferences>): UserPreferences {
  const current = getUserPreferences()
  const updated: UserPreferences = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString(),
  }

  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated))
  return updated
}

export function resetUserPreferences(): void {
  localStorage.removeItem(PREFERENCES_KEY)
}
