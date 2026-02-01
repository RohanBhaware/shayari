"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createShayari } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOODS, LANGUAGES } from "@/lib/types"
import { Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CreatePage() {
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("")
  const [language, setLanguage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!content.trim()) {
      setError("Please write something")
      return
    }

    if (!mood) {
      setError("Please select a mood")
      return
    }

    if (!language) {
      setError("Please select a language")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("content", content)
    formData.append("mood", mood)
    formData.append("language", language)

    const result = await createShayari({}, formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/feed")
      router.refresh()
    }
  }

  const charCount = content.length
  const maxChars = 500

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Create</h1>
          <p className="mt-1 text-muted-foreground">
            Share your thoughts with the world
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="content" className="text-base font-medium">
                  Your Shayari
                </Label>
                <span className={cn(
                  "text-xs",
                  charCount > maxChars ? "text-destructive" : "text-muted-foreground"
                )}>
                  {charCount}/{maxChars}
                </span>
              </div>
              <Textarea
                id="content"
                placeholder="दिल की बात लिखिए...&#10;Write from your heart..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-none font-serif text-lg leading-relaxed bg-background/50 border-border/50 placeholder:text-muted-foreground/50"
                maxLength={maxChars}
              />
            </div>

            {/* Mood and Language */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mood">Mood</Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger id="mood" className="bg-background/50">
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="bg-background/50">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading || !content.trim() || !mood || !language}
                className="gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Publish Shayari
              </Button>
            </div>
          </form>
        </Card>

        {/* Tips */}
        <div className="mt-8 rounded-xl border border-border/30 bg-card/30 p-6">
          <h3 className="font-medium text-foreground mb-3">Writing Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Write from the heart - authenticity resonates with readers</li>
            <li>Use line breaks to give your shayari rhythm and flow</li>
            <li>Choose a mood that matches the emotion of your words</li>
            <li>Mix languages if it feels natural to your expression</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
