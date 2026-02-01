"use client"

import React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ShayariCard } from "@/components/shayari-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Shayari, Profile, MOODS, LANGUAGES } from "@/lib/types"

interface ExploreContentProps {
  shayaris: Shayari[]
  poets: (Profile & { followers_count: number })[]
  moods: typeof MOODS
  languages: typeof LANGUAGES
  currentFilters: { mood?: string; language?: string; q?: string }
  currentUserId?: string
}

export function ExploreContent({
  shayaris: initialShayaris,
  poets,
  moods,
  languages,
  currentFilters,
  currentUserId,
}: ExploreContentProps) {
  const [shayaris, setShayaris] = useState(initialShayaris)
  const [searchQuery, setSearchQuery] = useState(currentFilters.q || "")
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleDelete(id: string) {
    setShayaris((prev) => prev.filter((s) => s.id !== id))
  }

  function updateFilters(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/explore?${params.toString()}`)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateFilters("q", searchQuery || null)
  }

  function clearFilters() {
    setSearchQuery("")
    router.push("/explore")
  }

  const hasFilters = currentFilters.mood || currentFilters.language || currentFilters.q

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shayaris..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Mood filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Filter by Mood</h3>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <Button
                key={mood.value}
                variant="outline"
                size="sm"
                onClick={() => updateFilters("mood", currentFilters.mood === mood.value ? null : mood.value)}
                className={cn(
                  "bg-transparent",
                  currentFilters.mood === mood.value && "bg-primary text-primary-foreground border-primary"
                )}
              >
                {mood.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Language filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Filter by Language</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.value}
                variant="outline"
                size="sm"
                onClick={() => updateFilters("language", currentFilters.language === lang.value ? null : lang.value)}
                className={cn(
                  "bg-transparent",
                  currentFilters.language === lang.value && "bg-primary text-primary-foreground border-primary"
                )}
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 bg-transparent">
              <X className="h-3 w-3" />
              Clear all
            </Button>
          </div>
        )}

        {/* Shayaris */}
        <div className="space-y-6">
          {shayaris.length > 0 ? (
            shayaris.map((shayari) => (
              <ShayariCard
                key={shayari.id}
                shayari={shayari}
                currentUserId={currentUserId}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No shayaris found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Trending poets */}
      <div className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
            Poets to Follow
          </h3>
          <div className="space-y-4">
            {poets.map((poet) => {
              const initials = poet.display_name
                ? poet.display_name.slice(0, 2).toUpperCase()
                : poet.username.slice(0, 2).toUpperCase()

              return (
                <Link
                  key={poet.id}
                  href={`/profile/${poet.username}`}
                  className="flex items-center gap-3 group"
                >
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {poet.display_name || poet.username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      @{poet.username} · {poet.followers_count} followers
                    </div>
                  </div>
                </Link>
              )
            })}

            {poets.length === 0 && (
              <p className="text-sm text-muted-foreground">No poets to show yet</p>
            )}
          </div>
        </Card>

        {/* Writing prompt */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
            Daily Inspiration
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            &ldquo;Write about a memory that still makes your heart ache.&rdquo;
          </p>
          <Button asChild className="w-full">
            <Link href="/create">Start Writing</Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}
