"use client"

import { useState } from "react"
import Link from "next/link"
import { ShayariCard } from "@/components/shayari-card"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"
import type { Shayari } from "@/lib/types"

interface FeedContentProps {
  initialShayaris: Shayari[]
  currentUserId?: string
}

export function FeedContent({ initialShayaris, currentUserId }: FeedContentProps) {
  const [shayaris, setShayaris] = useState(initialShayaris)

  function handleDelete(id: string) {
    setShayaris((prev) => prev.filter((s) => s.id !== id))
  }

  if (shayaris.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <PenLine className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
          Your feed is empty
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Follow some poets to see their shayaris here, or start by writing your own.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/create">Write a Shayari</Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/explore">Explore Poets</Link>
          </Button>
        </div>
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
