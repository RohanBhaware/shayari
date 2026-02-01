"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toggleLike, toggleSave, postComment } from "@/app/actions"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Bookmark, Share2, ArrowLeft, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { Shayari, Comment } from "@/lib/types"

interface ShayariDetailProps {
  shayari: Shayari
  comments: Comment[]
  currentUserId?: string
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

export function ShayariDetail({ shayari, comments: initialComments, currentUserId }: ShayariDetailProps) {
  const [isLiked, setIsLiked] = useState(shayari.is_liked || false)
  const [isSaved, setIsSaved] = useState(shayari.is_saved || false)
  const [likesCount, setLikesCount] = useState(shayari.likes_count || 0)
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const profile = shayari.profiles
  const initials = profile?.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : profile?.username?.slice(0, 2).toUpperCase() || "U"

  async function handleLike() {
    if (!currentUserId || isLoading) return

    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikesCount((prev) => newIsLiked ? prev + 1 : prev - 1)

    await toggleLike(shayari.id)
  }

  async function handleSave() {
    if (!currentUserId || isLoading) return

    const newIsSaved = !isSaved
    setIsSaved(newIsSaved)

    await toggleSave(shayari.id)
  }

  async function handleShare() {
    const url = window.location.href
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

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUserId || !newComment.trim() || isLoading) return
    setIsLoading(true)

    const result = await postComment(shayari.id, newComment)

    if (result.success && result.comment) {
      // We need profile info for the new comment. 
      // The server action returns the created comment doc, but not populated profile.
      // We can mock it with current user info or fetch.
      // Since currentUserId is passed, we hopefully have user info in parent or context.
      // But props only have currentUserId (string).
      // We might need to fetch profile or accept it as prop.
      // For now, let's just use placeholder or simple update.
      // Actually, standard pattern is `router.refresh()` to re-fetch server data.
      setNewComment("")
      // Optimistic update is hard without profile data.
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 -ml-2 bg-transparent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Shayari card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <Link
            href={`/profile/${profile?.username || shayari.user_id}`}
            className="flex items-center gap-3 group"
          >
            <Avatar className="h-12 w-12 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                {profile?.display_name || profile?.username || "Poet"}
              </div>
              <div className="text-sm text-muted-foreground">
                @{profile?.username || "user"} · {formatDistanceToNow(new Date(shayari.created_at), { addSuffix: true })}
              </div>
            </div>
          </Link>

          <span className={cn(
            "rounded-full px-3 py-1 text-sm font-medium capitalize",
            moodColors[shayari.mood] || "bg-muted text-muted-foreground"
          )}>
            {shayari.mood}
          </span>
        </div>

        {/* Content */}
        <p className="font-serif text-xl leading-relaxed text-foreground whitespace-pre-wrap mb-4">
          {shayari.content}
        </p>

        <div className="text-sm text-muted-foreground capitalize mb-6">
          {shayari.language}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!currentUserId}
              className={cn("gap-2 bg-transparent", isLiked && "text-pink-500")}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              <span>{likesCount}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={!currentUserId}
              className={cn("bg-transparent", isSaved && "text-accent")}
            >
              <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} className="bg-transparent">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Comments section */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          Comments ({comments.length})
        </h2>

        {/* Add comment */}
        {currentUserId && (
          <form onSubmit={handleComment} className="flex gap-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none bg-card/50"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newComment.trim() || isLoading}
              className="shrink-0 h-10 w-10"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {comments.map((comment) => {
            const commentInitials = comment.profiles?.display_name
              ? comment.profiles.display_name.slice(0, 2).toUpperCase()
              : comment.profiles?.username?.slice(0, 2).toUpperCase() || "U"

            return (
              <Card key={comment.id} className="border-border/50 bg-card/30 p-4">
                <div className="flex gap-3">
                  <Link href={`/profile/${comment.profiles?.username || comment.user_id}`}>
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {commentInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/profile/${comment.profiles?.username || comment.user_id}`}
                        className="font-medium text-sm text-foreground hover:text-primary"
                      >
                        {comment.profiles?.display_name || comment.profiles?.username || "User"}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-foreground/90 text-sm">{comment.content}</p>
                  </div>
                </div>
              </Card>
            )
          })}

          {comments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
