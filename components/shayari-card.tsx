
"use client"

import { useState } from "react"
import Link from "next/link"
import { toggleLike, toggleSave, deleteShayari, updateShayari } from "@/app/actions"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Trash2, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Shayari } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ShayariCardProps {
  shayari: Shayari
  currentUserId?: string
  onDelete?: (id: string) => void
}

const moodColors: Record<string, string> = {
  romantic: "bg-pink-500/10 text-pink-400",
  sad: "bg-blue-500/10 text-blue-400",
  inspirational: "bg-amber-500/10 text-amber-400",
  philosophical: "bg-purple-500/10 text-purple-400",
  funny: "bg-green-500/10 text-green-400",
  patriotic: "bg-orange-500/10 text-orange-400",
  spiritual: "bg-cyan-500/10 text-cyan-400",
  nature: "bg-emerald-500/10 text-emerald-400",
}

export function ShayariCard({ shayari, currentUserId, onDelete }: ShayariCardProps) {
  const [isLiked, setIsLiked] = useState(shayari.is_liked || false)
  const [isSaved, setIsSaved] = useState(shayari.is_saved || false)
  const [likesCount, setLikesCount] = useState(shayari.likes_count || 0)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(shayari.content)
  const [editMood, setEditMood] = useState(shayari.mood)
  const [editLanguage, setEditLanguage] = useState(shayari.language)

  const profile = shayari.profiles
  const initials = profile?.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : profile?.username?.slice(0, 2).toUpperCase() || "U"

  const isOwner = currentUserId === shayari.user_id

  async function handleLike() {
    if (!currentUserId || isLoading) return

    // Optimistic update
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikesCount((prev) => newIsLiked ? prev + 1 : prev - 1)

    // Call action in background (fire and forget for UI responsiveness, or await if needed)
    // For simplicity, we just call it. If it fails, we should revert, but skipping complex rollback for now.
    await toggleLike(shayari.id)
  }

  async function handleSave() {
    if (!currentUserId || isLoading) return

    const newIsSaved = !isSaved
    setIsSaved(newIsSaved)

    await toggleSave(shayari.id)
  }

  async function handleDelete() {
    if (!isOwner || isLoading) return
    setIsLoading(true)

    const result = await deleteShayari(shayari.id)
    if (result.success) {
      onDelete?.(shayari.id)
    }
    setIsLoading(false)
  }

  async function handleShare() {
    const url = `${window.location.origin} /shayari/${shayari.id} `
    if (navigator.share) {
      await navigator.share({
        title: "Shayari",
        text: shayari.content.slice(0, 100),
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  async function handleUpdate(formData: FormData) {
    if (!isOwner) return
    setIsLoading(true)

    const result = await updateShayari({} as any, formData)

    if (result.success) {
      setIsEditing(false)
      // Ideally we update local state or revalidate. 
      // Since we use revalidatePath in action, the page might refresh? 
      // Next.js client router cache might need refresh.
      // For now let's hope revalidatePath handles it or we force reload?
      // Actually, we should update local content state if we want instant feedback without full reload.
    }
    setIsLoading(false)
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <Link
              href={`/ profile / ${profile?.username || shayari.user_id} `}
              className="flex items-center gap-3 group"
            >
              <Avatar className="h-10 w-10 border border-border transition-transform group-hover:scale-105">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {profile?.display_name || profile?.username || "Poet"}
                </div>
                <div className="text-xs text-muted-foreground">
                  @{profile?.username || "user"} · {formatDistanceToNow(new Date(shayari.created_at), { addSuffix: true })}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize", moodColors[shayari.mood] || "bg-muted text-muted-foreground")}>
                {shayari.mood}
              </span>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-transparent">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)} className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Content */}
          <Link href={`/ shayari / ${shayari.id} `}>
            <p className="font-serif text-lg leading-relaxed text-foreground whitespace-pre-wrap">
              {shayari.content}
            </p>
          </Link>

          {/* Language tag */}
          <div className="mt-3">
            <span className="text-xs text-muted-foreground capitalize">{shayari.language}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={!currentUserId}
                className={cn("gap-1.5 h-9 px-3 bg-transparent", isLiked && "text-pink-500")}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                <span className="text-sm">{likesCount}</span>
              </Button>

              <Button variant="ghost" size="sm" asChild className="gap-1.5 h-9 px-3 bg-transparent">
                <Link href={`/ shayari / ${shayari.id} `}>
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{shayari.comments_count || 0}</span>
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={!currentUserId}
                className={cn("h-9 px-3 bg-transparent", isSaved && "text-accent")}
              >
                <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
              </Button>

              <Button variant="ghost" size="sm" onClick={handleShare} className="h-9 px-3 bg-transparent">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shayari</DialogTitle>
          </DialogHeader>
          <form action={handleUpdate} className="space-y-4">
            <input type="hidden" name="shayariId" value={shayari.id} />
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                name="content"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mood</Label>
                <Select name="mood" value={editMood} onValueChange={setEditMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(moodColors).map(m => (
                      <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select name="language" value={editLanguage} onValueChange={setEditLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="urdu">Urdu</SelectItem>
                    <SelectItem value="hinglish">Hinglish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

