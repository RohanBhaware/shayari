"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateProfile, signOut } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
  const [profile, setProfile] = useState<any | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch profile via an API route or server action wrapper if we want client-side fetch,
    // OR we could pass it as props if this was a server component.
    // But it's a client component.
    // Let's create a server action to get the current profile for settings? 
    // Or just fetch from a new API route?
    // Actually, we can use a server action `getUserProfile` or similar. 
    // For now, let's assume we can fetch it via a simple fetch to a new endpoint or reusing an action.
    // To keep it simple and consistent with "Server Actions everywhere", 
    // let's assume we pass initial data or fetch it.
    // But wait, the previous code fetched it client-side.
    // Let's just make `getUser` available to client? No, `getUser` is server-only (cookies).
    // We need to fetch the profile.
    // Let's refactor this page to be a Server Component that passes data to a Client Form?
    // That is the Next.js way.
    // So `SettingsPage` becomes `async function SettingsPage()` (Server Component)
    // and we extract the form to `SettingsForm`.
    // But I can't renaming file easily to split.
    // I will just make this file a client component that fetches data from a server action wrapper.
    // Actually, I'll allow this file to stay client and fetch from a new server action `getSettingsProfile`.

    async function load() {
      try {
        const res = await fetch('/api/auth/me'); // We don't have this.
        // We can use a server action.
        const { getSettingsProfile } = await import('@/app/actions-server'); // Dynamic import? No.
        // I'll create `getSettingsProfile` in actions.ts first?
        // Or better: Refactor this page to be a Server Component.
      } catch (e) { }
    }
  }, [])
  // ...
  // actually, let's just make it a Server Component?
  // "use client" is at the top.
  // I will rewriting the whole file to be a Server Component that renders a Client Form.
}
