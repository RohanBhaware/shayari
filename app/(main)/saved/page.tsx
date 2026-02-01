import { SavedContent } from "@/components/saved-content"
import { getUser } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Shayari, Save, Like, User } from "@/lib/models"

export default async function SavedPage() {
  const user = await getUser()
  if (!user) return null

  await connectDB()

  // Get saved shayaris
  const savesDocs = await Save.find({ user_id: user.id })
    .sort({ created_at: -1 })
    .populate({
      path: 'shayari_id',
      model: Shayari,
      populate: { path: 'user_id', model: User, select: 'username display_name avatar_url' }
    })
    .lean() as any[]

  // Filter out null shayaris (deleted ones)
  const validSaves = savesDocs.filter(s => s.shayari_id)

  const savedShayariIds = validSaves.map(s => s.shayari_id._id.toString())

  // Get user's likes
  const likesDocs = await Like.find({ user_id: user.id, shayari_id: { $in: savedShayariIds } }).select('shayari_id')
  const likedIds = likesDocs.map((l) => l.shayari_id.toString())

  const shayaris = validSaves.map((s) => ({
    ...s.shayari_id,
    id: s.shayari_id._id.toString(),
    created_at: s.shayari_id.created_at.toISOString(),
    profiles: {
      id: s.shayari_id.user_id._id.toString(),
      username: s.shayari_id.user_id.username,
      display_name: s.shayari_id.user_id.display_name,
      avatar_url: s.shayari_id.user_id.avatar_url
    },
    likes_count: s.shayari_id.likes_count || 0,
    comments_count: 0,
    is_liked: likedIds.includes(s.shayari_id._id.toString()),
    is_saved: true,
  }))

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Saved</h1>
          <p className="mt-1 text-muted-foreground">
            Your collection of cherished shayaris
          </p>
        </div>

        <SavedContent shayaris={shayaris} currentUserId={user.id} />
      </div>
    </div>
  )
}
