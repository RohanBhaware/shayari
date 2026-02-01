import { NotificationsContent } from "@/components/notifications-content"
import { getUser } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Notification, User, Shayari } from "@/lib/models"

export default async function NotificationsPage() {
  const user = await getUser()
  if (!user) return null

  await connectDB()

  // Get notifications
  const notificationsDocs = await Notification.find({ user_id: user.id })
    .sort({ created_at: -1 })
    .limit(50)
    .populate({ path: 'actor_id', model: User, select: 'username display_name avatar_url' })
    .populate({ path: 'shayari_id', model: Shayari, select: 'content' })
    .lean() as any[]

  // Mark all as read
  await Notification.updateMany({ user_id: user.id, read: false }, { read: true })

  const notifications = notificationsDocs.map(n => ({
    ...n,
    id: n._id.toString(),
    created_at: n.created_at.toISOString(),
    is_read: n.read,
    actor: {
      id: n.actor_id._id.toString(),
      username: n.actor_id.username,
      display_name: n.actor_id.display_name,
      avatar_url: n.actor_id.avatar_url
    },
    shayari: n.shayari_id ? {
      id: n.shayari_id._id.toString(),
      content: n.shayari_id.content
    } : null
  }))

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            Stay updated on your poetic journey
          </p>
        </div>

        <NotificationsContent notifications={notifications} />
      </div>
    </div>
  )
}
