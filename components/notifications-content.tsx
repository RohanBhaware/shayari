"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, UserPlus, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { Notification } from "@/lib/types"

interface NotificationsContentProps {
  notifications: Notification[]
}

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
}

const notificationMessages = {
  like: "liked your shayari",
  comment: "commented on your shayari",
  follow: "started following you",
}

export function NotificationsContent({ notifications }: NotificationsContentProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Bell className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
          No notifications yet
        </h2>
        <p className="text-muted-foreground max-w-md">
          When someone interacts with your shayaris or follows you, you&apos;ll see it here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || Bell
        const message = notificationMessages[notification.type as keyof typeof notificationMessages] || "interacted with you"
        const actor = notification.actor
        const initials = actor?.display_name
          ? actor.display_name.slice(0, 2).toUpperCase()
          : actor?.username?.slice(0, 2).toUpperCase() || "U"

        const href = notification.shayari_id
          ? `/shayari/${notification.shayari_id}`
          : actor?.username
            ? `/profile/${actor.username}`
            : "#"

        return (
          <Link key={notification.id} href={href}>
            <Card
              className={cn(
                "border-border/50 bg-card/50 backdrop-blur-sm p-4 transition-colors hover:bg-card",
                !notification.is_read && "border-l-2 border-l-primary"
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-foreground">
                      <span className="font-medium">
                        {actor?.display_name || actor?.username || "Someone"}
                      </span>{" "}
                      <span className="text-muted-foreground">{message}</span>
                    </p>
                  </div>

                  {notification.shayari && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1 font-serif italic">
                      &ldquo;{notification.shayari.content}&rdquo;
                    </p>
                  )}

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
