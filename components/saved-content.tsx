"use client"

import { useState } from "react"
import Link from "next/link"
import { ShayariCard } from "@/components/shayari-card"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import type { Shayari } from "@/lib/types"

interface SavedContentProps {
  shayaris: Shayari[]
  currentUserId: string
}

export function SavedContent({ shayaris: initialShayaris, currentUserId }: SavedContentProps) {
  const [shayaris, setShayaris] = useState(initialShayaris)

  function handleDelete(id: string) {
    setShayaris((prev) => prev.filter((s) => s.id !== id))
  }

  if (shayaris.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Bookmark className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
          No saved shayaris yet
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          When you save a shayari, it will appear here for you to revisit anytime.
        </p>
        <Button asChild>
          <Link href="/explore">Explore Shayaris</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {shayaris.map((shayari) => (
        <ShayariCard
          key={shayari.id}
          shayari={shayari}
          currentUserId={currentUserId}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
