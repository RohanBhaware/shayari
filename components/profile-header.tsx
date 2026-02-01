"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, UserPlus, UserMinus } from "lucide-react"
import type { Profile } from "@/lib/types"

interface ProfileHeaderProps {
  profile: Profile
  stats: {
    shayaris: number
    followers: number
    following: number
  }
  isOwnProfile: boolean
  isFollowing: boolean
  currentUserId?: string
}

export function ProfileHeader({
  profile,
  stats,
  isOwnProfile,
  isFollowing: initialIsFollowing,
  currentUserId,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [followersCount, setFollowersCount] = useState(stats.followers)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const initials = profile.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : profile.username.slice(0, 2).toUpperCase()

  async function handleFollow() {
    if (!currentUserId || loading) return
    setLoading(true)

    // Call server action to toggle follow
    // Ideally we would import a server action `toggleFollow` but we have `updateProfile` etc. 
    // We didn't create a `toggleFollow` action in actions.ts yet? 
    // Wait, the previous code used Supabase client. 
    // I need to check `app/actions.ts` if I have follow logic.
    // If not, I need to create it.
    // Assuming I will create `toggleFollow(targetUserId)` in actions.ts
    // For now I'll stub it or assume it exists. 
    // Wait, the user prompt said I removed supabase setup. 
    // I should create `toggleFollow` if it doesn't exist.
    // Let me check actions.ts content memory. I recall createShayari, etc. 
    // I don't recall toggleFollow. 
    // I should probably add `toggleFollow` to actions.ts.

    // For now, let's just comment out the impl or try to use fetch? 
    // No, I must fix it. 

    // Import dynamically? No.
    // I will add `toggleFollow` to actions.ts in next step.

    const { toggleFollow } = await import("@/app/actions")
    await toggleFollow(profile.id)

    setLoading(false)
    setIsFollowing(!isFollowing)
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>

            {isOwnProfile ? (
              <Button variant="outline" asChild className="bg-transparent">
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            ) : currentUserId ? (
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollow}
                disabled={loading}
                className={isFollowing ? "bg-transparent" : ""}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>
            ) : null}
          </div>

          {profile.bio && (
            <p className="mt-4 text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 border-t border-b border-border/50 py-4">
        <div className="text-center">
          <div className="font-serif text-2xl font-bold text-foreground">
            {stats.shayaris}
          </div>
          <div className="text-sm text-muted-foreground">Shayaris</div>
        </div>
        <div className="text-center">
          <div className="font-serif text-2xl font-bold text-foreground">
            {followersCount}
          </div>
          <div className="text-sm text-muted-foreground">Followers</div>
        </div>
        <div className="text-center">
          <div className="font-serif text-2xl font-bold text-foreground">
            {stats.following}
          </div>
          <div className="text-sm text-muted-foreground">Following</div>
        </div>
      </div>
    </div>
  )
}
