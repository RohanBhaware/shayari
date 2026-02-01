"use client"

import { useState } from "react"
import { ShayariCard } from "@/components/shayari-card"
import { PenLine } from "lucide-react"
import type { Shayari } from "@/lib/types"

interface ProfileShayarisProps {
  shayaris: Shayari[]
  currentUserId?: string
}

export function ProfileShayaris({ shayaris: initialShayaris, currentUserId }: ProfileShayarisProps) {
  const [shayaris, setShayaris] = useState(initialShayaris)

  function handleDelete(id: string) {
    setShayaris((prev) => prev.filter((s) => s.id !== id))
  }

  if (shayaris.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <PenLine className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No shayaris yet</p>
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
